import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

const API_URL = 'http://localhost:3001/api';

function Analytics() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [metric, setMetric] = useState('');
  const [period, setPeriod] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    // 从URL参数读取分析参数
    const urlMetric = searchParams.get('metric');
    const urlPeriod = searchParams.get('period');
    const urlFilter = searchParams.get('filter');

    if (urlMetric || urlPeriod || urlFilter) {
      setMetric(urlMetric || '');
      setPeriod(urlPeriod || '');
      setFilter(urlFilter || '');
      fetchAnalytics(urlMetric, urlPeriod, urlFilter);
    }
  }, [searchParams]);

  const fetchAnalytics = async (m, p, f) => {
    try {
      const params = new URLSearchParams();
      if (m) params.append('metric', m);
      if (p) params.append('period', p);
      if (f) params.append('filter', f);

      const response = await axios.get(`${API_URL}/analytics?${params.toString()}`);
      setAnalyticsData(response.data);
    } catch (err) {
      console.error('获取分析数据失败', err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (metric) params.append('metric', metric);
    if (period) params.append('period', period);
    if (filter) params.append('filter', filter);
    setSearchParams(params);
    fetchAnalytics(metric, period, filter);
  };

  return (
    <div>
      <h2>数据分析面板</h2>
      <p>查看网站访问统计和数据分析报告。</p>

      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h3>查询分析数据</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>指标类型</label>
            <select
              className="form-control"
              value={metric}
              onChange={(e) => setMetric(e.target.value)}
            >
              <option value="">请选择指标</option>
              <option value="views">浏览量</option>
              <option value="users">用户数</option>
              <option value="comments">评论数</option>
              <option value="shares">分享数</option>
            </select>
          </div>
          <div className="form-group">
            <label>时间周期</label>
            <select
              className="form-control"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option value="">请选择周期</option>
              <option value="today">今天</option>
              <option value="week">本周</option>
              <option value="month">本月</option>
              <option value="year">本年</option>
            </select>
          </div>
          <div className="form-group">
            <label>过滤条件</label>
            <input
              type="text"
              className="form-control"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="输入过滤条件（可选）"
            />
          </div>
          <button type="submit" className="btn btn-primary">查询</button>
        </form>
      </div>

      {analyticsData && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3>分析结果</h3>
          <div style={{ marginBottom: '1rem' }}>
            <strong>指标：</strong>
            {/* 新漏洞点：反射型XSS - 指标参数 */}
            <span dangerouslySetInnerHTML={{ __html: analyticsData.metric || '未设置' }}></span>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <strong>周期：</strong>
            {/* 新漏洞点：反射型XSS - 周期参数 */}
            <span dangerouslySetInnerHTML={{ __html: analyticsData.period || '未设置' }}></span>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <strong>过滤条件：</strong>
            {/* 新漏洞点：反射型XSS - 过滤参数 */}
            <span dangerouslySetInnerHTML={{ __html: analyticsData.filter || '未设置' }}></span>
          </div>
          <div>
            <strong>数据：</strong>
            <pre>{JSON.stringify(analyticsData.data, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default Analytics;

