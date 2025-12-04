import React, { useState, useEffect } from 'react';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [userId, setUserId] = useState('');
  const [sortBy, setSortBy] = useState('order_date');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [statusFilter, setStatusFilter] = useState('');
  const [message, setMessage] = useState('');

  const API_BASE = 'http://localhost:3001';

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      let url = `${API_BASE}/api/orders?sort=${sortBy}&order=${sortOrder}`;
      if (statusFilter) {
        url += `&status=${statusFilter}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      if (data.data) {
        setOrders(data.data);
        setMessage('');
      } else if (data.error) {
        setMessage(`错误: ${data.error}`);
      }
    } catch (error) {
      setMessage(`加载订单失败: ${error.message}`);
    }
  };

  const loadUserOrders = async () => {
    if (!userId) {
      setMessage('请输入用户ID');
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE}/api/orders/user/${userId}`);
      const data = await response.json();
      if (data.data) {
        setOrders(data.data);
        setMessage(`已加载用户 ${userId} 的订单`);
      } else if (data.error) {
        setMessage(`错误: ${data.error}`);
      }
    } catch (error) {
      setMessage(`加载用户订单失败: ${error.message}`);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!confirm('确定要删除这个订单吗？')) return;
    
    try {
      const response = await fetch(`${API_BASE}/api/orders/${orderId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.message) {
        setMessage(`成功: ${data.message}`);
        loadOrders();
      } else if (data.error) {
        setMessage(`错误: ${data.error}`);
      }
    } catch (error) {
      setMessage(`删除失败: ${error.message}`);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return '#28a745';
      case 'shipped': return '#17a2b8';
      case 'pending': return '#ffc107';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      'completed': '已完成',
      'shipped': '已发货',
      'pending': '待处理',
      'cancelled': '已取消'
    };
    return statusMap[status] || status;
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>订单管理</h1>

      {/* 控制面板 */}
      <div style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '20px', 
        borderRadius: '8px', 
        marginBottom: '20px' 
      }}>
        {/* 按用户ID查询 */}
        <div style={{ marginBottom: '15px' }}>
          <h3 style={{ marginTop: 0 }}>按用户查询</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="输入用户ID..."
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              style={{ flex: 1, padding: '8px' }}
            />
            <button onClick={loadUserOrders} style={{ padding: '8px 20px' }}>
              查询用户订单
            </button>
          </div>
        </div>

        {/* 排序和筛选 */}
        <div>
          <h3>排序和筛选</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ padding: '8px' }}
            >
              <option value="order_date">订单日期</option>
              <option value="total_price">订单金额</option>
              <option value="status">订单状态</option>
              <option value="id">订单ID</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              style={{ padding: '8px' }}
            >
              <option value="DESC">降序</option>
              <option value="ASC">升序</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ padding: '8px' }}
            >
              <option value="">所有状态</option>
              <option value="pending">待处理</option>
              <option value="shipped">已发货</option>
              <option value="completed">已完成</option>
              <option value="cancelled">已取消</option>
            </select>
            <button onClick={loadOrders} style={{ padding: '8px 20px' }}>
              应用筛选
            </button>
            <button 
              onClick={() => {
                setUserId('');
                setSortBy('order_date');
                setSortOrder('DESC');
                setStatusFilter('');
                loadOrders();
              }}
              style={{ padding: '8px 20px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px' }}
            >
              重置
            </button>
          </div>
        </div>
      </div>

      {/* 消息提示 */}
      {message && (
        <div style={{
          padding: '10px',
          marginBottom: '20px',
          borderRadius: '4px',
          backgroundColor: message.includes('成功') ? '#d4edda' : '#f8d7da',
          color: message.includes('成功') ? '#155724' : '#721c24',
          border: `1px solid ${message.includes('成功') ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          {message}
        </div>
      )}

      {/* 订单列表 */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          backgroundColor: '#fff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>订单ID</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>用户</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>产品</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>数量</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>总价</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>状态</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>日期</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                <td style={{ padding: '12px' }}>#{order.id}</td>
                <td style={{ padding: '12px' }}>
                  {order.username ? `${order.username} (ID: ${order.user_id})` : `用户ID: ${order.user_id}`}
                </td>
                <td style={{ padding: '12px' }}>{order.product_name || `产品ID: ${order.product_id}`}</td>
                <td style={{ padding: '12px' }}>{order.quantity}</td>
                <td style={{ padding: '12px' }}>¥{order.total_price}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: getStatusColor(order.status),
                    color: '#fff',
                    fontSize: '12px'
                  }}>
                    {getStatusText(order.status)}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>{order.order_date}</td>
                <td style={{ padding: '12px' }}>
                  <button
                    onClick={() => handleDeleteOrder(order.id)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#dc3545',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {orders.length === 0 && (
        <p style={{ textAlign: 'center', color: '#999', marginTop: '40px' }}>
          没有找到订单
        </p>
      )}

      {/* 统计信息 */}
      {orders.length > 0 && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px' 
        }}>
          <h3>统计信息</h3>
          <p>总订单数: {orders.length}</p>
          <p>总金额: ¥{orders.reduce((sum, order) => sum + parseFloat(order.total_price), 0).toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}

export default Orders;

