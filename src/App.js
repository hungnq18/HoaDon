import React, { useState } from 'react';
import Invoice from './Invoice';

function App() {
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);

  const handleShowInvoiceForm = () => {
    setShowInvoiceForm(true);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Trang chủ</h1>
        <button className="actions" onClick={handleShowInvoiceForm}>Hiển thị hóa đơn</button>
      </header>
      {showInvoiceForm && <Invoice />}
    </div>
  );
}

export default App;

