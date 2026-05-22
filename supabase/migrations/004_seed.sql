insert into public.flights (flight_no, origin, destination, departs_at, arrives_at, aircraft_type, status, base_price) values
('AI-101', 'Delhi', 'Mumbai', '2026-06-01 06:00:00+05:30', '2026-06-01 08:00:00+05:30', 'Boeing 737', 'scheduled', 3500),
('AI-102', 'Mumbai', 'Delhi', '2026-06-01 10:00:00+05:30', '2026-06-01 12:00:00+05:30', 'Boeing 737', 'scheduled', 3500),
('AI-201', 'Delhi', 'Bangalore', '2026-06-01 07:00:00+05:30', '2026-06-01 09:30:00+05:30', 'Airbus A320', 'scheduled', 4500),
('AI-202', 'Bangalore', 'Delhi', '2026-06-01 11:00:00+05:30', '2026-06-01 13:30:00+05:30', 'Airbus A320', 'scheduled', 4500),
('AI-301', 'Mumbai', 'Bangalore', '2026-06-02 08:00:00+05:30', '2026-06-02 09:30:00+05:30', 'Boeing 737', 'scheduled', 3000),
('AI-302', 'Bangalore', 'Mumbai', '2026-06-02 12:00:00+05:30', '2026-06-02 13:30:00+05:30', 'Boeing 737', 'scheduled', 3000),
('AI-401', 'Delhi', 'Chennai', '2026-06-02 09:00:00+05:30', '2026-06-02 11:30:00+05:30', 'Airbus A320', 'scheduled', 5000),
('AI-402', 'Chennai', 'Delhi', '2026-06-02 14:00:00+05:30', '2026-06-02 16:30:00+05:30', 'Airbus A320', 'scheduled', 5000);

do $$
declare
  f record;
  row_num int;
  col_num int;
  seat_class text;
  extra numeric;
begin
  for f in select id from public.flights loop
    for row_num in 1..30 loop
      for col_num in 1..6 loop
        if row_num <= 2 then
          seat_class := 'first';
          extra := 2000;
        elsif row_num <= 8 then
          seat_class := 'business';
          extra := 1000;
        else
          seat_class := 'economy';
          extra := 0;
        end if;

        insert into public.seats (flight_id, seat_number, class, is_available, extra_fee)
        values (
          f.id,
          row_num || chr(64 + col_num),
          seat_class,
          true,
          extra
        );
      end loop;
    end loop;
  end loop;
end;
$$;
