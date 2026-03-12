#!/bin/bash

# MasterGo 动效插件演示启动脚本

echo "🚀 启动 MasterGo 动效插件演示..."

# 检查是否已安装依赖
if [ ! -d "node_modules" ]; then
    echo "📦 正在安装依赖..."
    npm install
fi

# 构建项目
echo "🔨 正在构建项目..."
npm run build

# 启动开发服务器
echo "🌐 启动开发服务器..."
echo "💡 请在浏览器中打开以下地址："
echo "   主插件界面: http://localhost:3000"
echo "   奶茶店演示: http://localhost:3000/milktea-demo.html"
echo "   插件演示: http://localhost:3000/plugin-demo.html"
echo ""
echo "🔧 按 Ctrl+C 停止服务器"

npx webpack serve --mode development