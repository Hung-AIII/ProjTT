<template>
  <div class="admin-orders">
    <h1>Manage Orders</h1>
    
    <table class="order-table glass-card">
      <thead>
        <tr>
          <th>Order #</th>
          <th>Customer</th>
          <th>Total</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>#001</td>
          <td>Nguyễn Văn A</td>
          <td>450,000đ</td>
          <td><span class="status-pending">Processing</span></td>
          <td>
            <button class="btn-status">Update</button>
          </td>
        </tr>
        <tr>
          <td>#002</td>
          <td>Trần Thị B</td>
          <td>680,000đ</td>
          <td><span class="status-shipped">Shipped</span></td>
          <td>
            <button class="btn-status">Update</button>
          </td>
        </tr>
        <tr>
          <td colspan="5" class="empty-row">No more orders to display.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.admin-orders {
  padding: 20px;
}
.admin-orders h1 {
  font-size: 28px;
  letter-spacing: 3px;
  font-weight: 700;
  margin-bottom: 20px;
}
.order-table {
  width: 100%;
  border-collapse: collapse;
  overflow: hidden;
}
.order-table th {
  background: rgba(255, 255, 255, 0.05);
  padding: 14px 16px;
  text-align: left;
  font-weight: 600;
  letter-spacing: 1px;
  font-size: 14px;
  text-transform: uppercase;
}
.order-table td {
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}
.order-table tr:hover td {
  background: rgba(255, 255, 255, 0.02);
}
.status-pending {
  background: #f39c12;
  color: var(--primary);
  padding: 4px 14px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.5px;
}
.status-shipped {
  background: var(--accent);
  color: var(--primary);
  padding: 4px 14px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.5px;
}
.btn-status {
  padding: 6px 16px;
  background: transparent;
  color: var(--text-muted);
  border: 1px solid var(--border-dark);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 13px;
}
.btn-status:hover {
  border-color: var(--accent);
  color: var(--accent);
}
.empty-row {
  text-align: center;
  color: var(--text-muted);
  font-style: italic;
  padding: 24px !important;
}
</style>