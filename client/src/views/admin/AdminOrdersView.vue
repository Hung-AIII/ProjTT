<template>
  <div class="p-6 pt-24">
    <h1 class="text-3xl font-bold text-light tracking-wider">📋 Quản lý đơn hàng</h1>
    
    <div class="bg-dark3/80 backdrop-blur-lg border border-white/5 rounded-lg overflow-hidden mt-6">
      <table class="w-full">
        <thead class="bg-white/5">
          <tr>
            <th class="text-left text-muted text-sm uppercase tracking-wider px-4 py-3">Mã đơn</th>
            <th class="text-left text-muted text-sm uppercase tracking-wider px-4 py-3">Khách hàng</th>
            <th class="text-left text-muted text-sm uppercase tracking-wider px-4 py-3">Tổng tiền</th>
            <th class="text-left text-muted text-sm uppercase tracking-wider px-4 py-3">Trạng thái</th>
            <th class="text-left text-muted text-sm uppercase tracking-wider px-4 py-3">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-t border-white/5 hover:bg-white/5">
            <td class="px-4 py-3 text-muted">#001</td>
            <td class="px-4 py-3 text-light">Nguyễn Văn A</td>
            <td class="px-4 py-3 text-gold">450,000đ</td>
            <td class="px-4 py-3"><span class="bg-gold/20 text-gold text-xs px-3 py-1 rounded-full">Đang xử lý</span></td>
            <td class="px-4 py-3">
              <button class="text-gold hover:text-goldHover transition">Cập nhật</button>
            </td>
          </tr>
          <tr class="border-t border-white/5 hover:bg-white/5">
            <td class="px-4 py-3 text-muted">#002</td>
            <td class="px-4 py-3 text-light">Trần Thị B</td>
            <td class="px-4 py-3 text-gold">680,000đ</td>
            <td class="px-4 py-3"><span class="bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full">Đã giao</span></td>
            <td class="px-4 py-3">
              <button class="text-gold hover:text-goldHover transition">Cập nhật</button>
            </td>
          </tr>
          <tr>
            <td colspan="5" class="text-center text-muted italic py-6">Không có đơn hàng nào để hiển thị.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>