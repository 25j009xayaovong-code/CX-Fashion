# FASHION STORE

## เชื่อม Supabase เพื่อใช้ข้อมูลข้ามเครื่อง

1. สร้างโปรเจกต์ใน [Supabase](https://supabase.com) แล้วเปิด **SQL Editor**
2. วางและรันไฟล์ [`supabase/schema.sql`](./supabase/schema.sql) ทั้งหมด
3. คัดลอก `.env.example` เป็น `.env` แล้วกรอก Project URL และ anon/publishable key จาก Supabase Dashboard > Connect
4. ใน Authentication > Providers เปิด Email และตั้งค่าให้เหมาะกับการใช้งาน (สามารถปิด Confirm email ระหว่างทดสอบได้)
5. สมัครสมาชิกบัญชีแรกผ่านหน้าเว็บ แล้วรันคำสั่งท้ายไฟล์ SQL เพื่อกำหนดบัญชีนั้นเป็น `admin`
6. หากใช้ปุ่มจัดการผู้ดูแล ให้ deploy Edge Functions: `supabase functions deploy create-admin` และ `supabase functions deploy delete-admin` (secret `SUPABASE_SERVICE_ROLE_KEY` มีอยู่ใน Supabase Edge Functions โดยอัตโนมัติ)

ห้ามใส่ `service_role` key ลงใน `.env` ของเว็บเด็ดขาด เพราะ key นี้ใช้ฝั่งเซิร์ฟเวอร์เท่านั้น

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
