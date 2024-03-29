import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import viteCompression from 'vite-plugin-compression' //启用压缩插件，并在构建时压缩资源文件

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      imports: ['vue', 'vue-router', 'pinia']
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    }),
    viteCompression()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api/': { // 获取了路径当中包含api的请求
        target: 'http://122.9.35.239:8848', // 向前端所在服务器发起请求，再根据它内部配置去请求后端服务器（只有浏览器存在跨域问题）
        //target: 'http://localhost:8080', // 开发环境下直接向本地后端服务器发请求即可
        changeOrigin: true // 修改源（不同源指不同协议，不同域名，不同端口，）
      }
    }
  }
})
