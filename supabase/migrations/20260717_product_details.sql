-- Run this migration in Supabase Dashboard > SQL Editor for an existing project.
alter table public.products add column if not exists description text not null default '';
alter table public.products add column if not exists sizes text[] not null default array['One size'];
alter table public.order_items add column if not exists size text;

-- Give the existing sample catalogue sensible choices. Admins can edit these later.
update public.products
set sizes = array['S', 'M', 'L', 'XL']
where category = 'เสื้อผ้า' and sizes = array['One size'];

update public.products
set sizes = array['38', '39', '40', '41', '42']
where category = 'รองเท้า' and sizes = array['One size'];

create or replace function public.create_order(payload jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare order_id uuid := gen_random_uuid(); item jsonb; current_stock integer;
begin
  if auth.uid() is null then raise exception 'Please sign in before checkout'; end if;
  for item in select * from jsonb_array_elements(payload -> 'items') loop
    select stock into current_stock from public.products where id = (item ->> 'id')::bigint for update;
    if current_stock is null or current_stock < (item ->> 'qty')::integer then raise exception 'สินค้าในคลังมีไม่เพียงพอ'; end if;
  end loop;
  insert into public.orders (id, order_number, user_id, buyer, contact, address, payment, subtotal, discount_amount, shipping_fee, coupon, coupon_label, total)
  values (order_id, payload ->> 'orderId', auth.uid(), payload ->> 'buyer', payload ->> 'contact', payload ->> 'address', payload ->> 'payment', (payload ->> 'subtotal')::integer, (payload ->> 'discountAmount')::integer, (payload ->> 'shippingFee')::integer, payload ->> 'coupon', payload ->> 'couponLabel', (payload ->> 'total')::integer);
  for item in select * from jsonb_array_elements(payload -> 'items') loop
    update public.products set stock = stock - (item ->> 'qty')::integer where id = (item ->> 'id')::bigint;
    insert into public.order_items (order_id, product_id, name, price, quantity, size, image_url)
    values (order_id, (item ->> 'id')::bigint, item ->> 'name', (item ->> 'price')::integer, (item ->> 'qty')::integer, item ->> 'size', item ->> 'img');
  end loop;
  return order_id;
end;
$$;
