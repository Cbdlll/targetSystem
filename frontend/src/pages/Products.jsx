import React, { useState, useEffect } from 'react';

function Products() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stockQuantity, setStockQuantity] = useState('');
  const [message, setMessage] = useState('');

  const API_BASE = 'http://localhost:3001';

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/products`);
      const data = await response.json();
      if (data.data) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error('加载产品失败:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      let url = `${API_BASE}/api/products/search?`;
      if (searchTerm) url += `q=${encodeURIComponent(searchTerm)}&`;
      if (selectedCategory) url += `category=${encodeURIComponent(selectedCategory)}`;
      
      const response = await fetch(url);
      const data = await response.json();
      if (data.data) {
        setProducts(data.data);
        setMessage('');
      } else if (data.error) {
        setMessage(`错误: ${data.error}`);
      }
    } catch (error) {
      setMessage(`搜索失败: ${error.message}`);
    }
  };

  const handleViewDetails = async (productId) => {
    try {
      const response = await fetch(`${API_BASE}/api/products/${productId}`);
      const data = await response.json();
      if (data.data) {
        setSelectedProduct(data.data);
        setStockQuantity(data.data.stock);
        setMessage('');
      } else if (data.error) {
        setMessage(`错误: ${data.error}`);
      }
    } catch (error) {
      setMessage(`获取详情失败: ${error.message}`);
    }
  };

  const handleUpdateStock = async () => {
    if (!selectedProduct) return;
    
    try {
      const response = await fetch(`${API_BASE}/api/products/${selectedProduct.id}/stock`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: stockQuantity })
      });
      const data = await response.json();
      if (data.message) {
        setMessage(`成功: ${data.message}`);
        loadProducts();
        setSelectedProduct(null);
      } else if (data.error) {
        setMessage(`错误: ${data.error}`);
      }
    } catch (error) {
      setMessage(`更新失败: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>产品商城</h1>

      {/* 搜索区域 */}
      <div style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '20px', 
        borderRadius: '8px', 
        marginBottom: '20px' 
      }}>
        <h3>搜索产品</h3>
        <form onSubmit={handleSearch}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="搜索产品名称..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ flex: 1, padding: '8px' }}
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ padding: '8px' }}
            >
              <option value="">所有分类</option>
              <option value="电子产品">电子产品</option>
              <option value="配件">配件</option>
            </select>
            <button type="submit" style={{ padding: '8px 20px' }}>
              搜索
            </button>
            <button 
              type="button" 
              onClick={loadProducts}
              style={{ padding: '8px 20px' }}
            >
              重置
            </button>
          </div>
        </form>
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

      {/* 产品列表 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {products.map(product => (
          <div 
            key={product.id} 
            style={{ 
              border: '1px solid #ddd', 
              borderRadius: '8px', 
              padding: '15px',
              backgroundColor: '#fff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <h3 style={{ marginTop: 0 }}>{product.name}</h3>
            <p style={{ color: '#666', fontSize: '14px' }}>{product.description}</p>
            <div style={{ marginTop: '10px' }}>
              <p><strong>价格:</strong> ¥{product.price}</p>
              <p><strong>库存:</strong> {product.stock} 件</p>
              <p><strong>分类:</strong> {product.category}</p>
            </div>
            <button 
              onClick={() => handleViewDetails(product.id)}
              style={{ 
                marginTop: '10px', 
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              查看详情
            </button>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <p style={{ textAlign: 'center', color: '#999', marginTop: '40px' }}>
          没有找到产品
        </p>
      )}

      {/* 产品详情弹窗 */}
      {selectedProduct && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#fff',
            padding: '30px',
            borderRadius: '8px',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h2>{selectedProduct.name}</h2>
            <p><strong>描述:</strong> {selectedProduct.description}</p>
            <p><strong>价格:</strong> ¥{selectedProduct.price}</p>
            <p><strong>当前库存:</strong> {selectedProduct.stock}</p>
            <p><strong>分类:</strong> {selectedProduct.category}</p>
            
            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
              <h3 style={{ marginTop: 0 }}>库存管理</h3>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <label>新库存数量:</label>
                <input
                  type="text"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  placeholder="输入数量"
                  style={{ flex: 1, padding: '8px' }}
                />
                <button 
                  onClick={handleUpdateStock}
                  style={{ 
                    padding: '8px 16px',
                    backgroundColor: '#28a745',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  更新库存
                </button>
              </div>
            </div>

            <button
              onClick={() => setSelectedProduct(null)}
              style={{
                marginTop: '20px',
                padding: '8px 16px',
                backgroundColor: '#6c757d',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;


