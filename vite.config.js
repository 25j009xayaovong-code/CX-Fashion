import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev
export default defineConfig({
  plugins: [react()],
  base: '/CX-Fashion/', // <--- เพิ่มบรรทัดนี้ลงไป (ใส่เครื่องหมายสแลชปิดหัวท้ายด้วย)
})
