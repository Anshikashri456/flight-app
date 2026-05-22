create or replace function reserve_seat(
  p_flight_id uuid,
  p_seat_id uuid,
  p_user_id uuid,
  p_total_price numeric,
  p_passenger jsonb
)
returns json
language plpgsql
security definer
as $$
declare
  v_booking_id uuid;
  v_pnr text;
  v_seat_available boolean;
begin
  select is_available into v_seat_available
  from public.seats
  where id = p_seat_id and flight_id = p_flight_id
  for update;

  if not found then
    return json_build_object('success', false, 'error', 'Seat not found');
  end if;

  if not v_seat_available then
    return json_build_object('success', false, 'error', 'Seat already taken');
  end if;

  update public.seats set is_available = false
  where id = p_seat_id;

  v_pnr := upper(substring(gen_random_uuid()::text, 1, 8));

  insert into public.bookings (user_id, flight_id, seat_id, total_price, pnr_code)
  values (p_user_id, p_flight_id, p_seat_id, p_total_price, v_pnr)
  returning id into v_booking_id;

  insert into public.passengers (booking_id, full_name, passport_no, nationality, dob)
  values (
    v_booking_id,
    p_passenger->>'full_name',
    p_passenger->>'passport_no',
    p_passenger->>'nationality',
    (p_passenger->>'dob')::date
  );

  return json_build_object(
    'success', true,
    'booking_id', v_booking_id,
    'pnr_code', v_pnr
  );
end;
$$;

create or replace function cancel_booking(p_booking_id uuid, p_user_id uuid)
returns json
language plpgsql
security definer
as $$
declare
  v_flight_id uuid;
  v_seat_id uuid;
  v_departs_at timestamptz;
begin
  select b.flight_id, b.seat_id, f.departs_at
  into v_flight_id, v_seat_id, v_departs_at
  from public.bookings b
  join public.flights f on f.id = b.flight_id
  where b.id = p_booking_id and b.user_id = p_user_id and b.status = 'confirmed'
  for update;

  if not found then
    return json_build_object('success', false, 'error', 'Booking not found or already cancelled');
  end if;

  if v_departs_at - now() < interval '2 hours' then
    return json_build_object('success', false, 'error', 'Cannot cancel within 2 hours of departure');
  end if;

  update public.seats set is_available = true where id = v_seat_id;
  update public.bookings set status = 'cancelled' where id = p_booking_id;

  return json_build_object('success', true);
end;
$$;

create or replace function check_cancellation_time()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'cancelled' and old.status = 'confirmed' then
    if (select departs_at from public.flights where id = old.flight_id) - now() < interval '2 hours' then
      raise exception 'Cancellation not allowed within 2 hours of departure';
    end if;
  end if;
  return new;
end;
$$;

create trigger enforce_cancellation_window
before update on public.bookings
for each row execute function check_cancellation_time();
