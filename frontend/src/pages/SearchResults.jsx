import React from 'react';
import { useSearchParams } from 'react-router-dom';

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  // 仅用于演示eval()漏洞的函数
  const runDebug = () => {
    console.log('正在执行开发者调试...');
    // eval() XSS 漏洞
    eval(`console.log('搜索词调试: ${query}')`);
  };

  return (
    <div>
      <h2 className="page-title">
        搜索结果
      </h2>
      
      {query ? (
        <div>
          <p>
            您搜索的关键词是： <strong dangerouslySetInnerHTML={{ __html: query }}></strong>
          </p>
          
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label>搜索词回显:</label>
            {/* 属性节点 XSS 漏洞 */}
            <input type="text" className="form-control" defaultValue={query} disabled />
          </div>

          <div className="dev-debug-area" style={{ marginTop: '2rem', padding: '1rem', border: '1px dashed #ccc' }}>
            <p><strong>开发者调试区</strong></p>
            <button className="btn btn-secondary" onClick={runDebug}>运行调试</button>
          </div>

        </div>
      ) : (
        <p>请输入关键词进行搜索。</p>
      )}

      <div className="news-list" style={{marginTop: '2rem'}}>
        <h4>相关结果：</h4>
        <p>（模拟搜索结果，未找到与查询相关的文章）</p>
      </div>
    </div>
  );
}

export default SearchResults;
