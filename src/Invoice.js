import React, { useEffect, useState } from 'react';
import './invoice.css';

function InvoiceForm() {
  const [invoiceData, setInvoiceData] = useState({
    seller: {
      name: '',
      company: '',
      address: '',
      phone: '',
      paymentMethod: '',
      accountNumber: ''
    },
    buyer: {
      name: '',
      company: '',
      taxCode: '',
      address: '',
      phone: '',
      paymentMethod: '',
      accountNumber: ''
    },
    items: [],
    totalAmount: '',
    amountInWords: ''
  });
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false); 
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetch('/http://localhost:9999/invoice')
      .then(response => response.json())
      .then(data => {
        setInvoiceData(data);
        setRows(data.items);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const handleInputChange = (section, field, value) => {
    const newData = { ...invoiceData };
    newData[section][field] = value;
    setInvoiceData(newData);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    setShowPreview(true);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
  };

  const handleAddRow = () => {
    const newRow = { id: rows.length + 1, name: '', quantity: '', price: '', total: '' };
    setRows([...rows, newRow]);
  };

  const handleChange = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    newRows[index].total = (newRows[index].quantity * newRows[index].price) || '';
    setRows(newRows);
    calculateTotalAmount(newRows);
  };

  const calculateTotalAmount = (rows) => {
    const totalAmount = rows.reduce((sum, row) => sum + (parseFloat(row.total) || 0), 0);
    setInvoiceData(prevInvoiceData => ({
      ...prevInvoiceData,
      totalAmount: totalAmount.toFixed(2)
    }));
  };

  const handleSaveInvoice = () => {
    console.log('Invoice data:', invoiceData);
    setShowPreview(false);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="invoice-form">
      <div className="header">
        <h2>HÓA ĐƠN BÁN HÀNG</h2>
        <div className="date-section">
          Ngày (date)...........tháng (month)..........năm (year)...........
        </div>
      </div>
      <div className="first-information">
        <div className="section">
          <label>Họ tên người bán hàng: </label><input type="text" value={invoiceData.seller.name} onChange={(e) => handleInputChange('seller', 'name', e.target.value)} />
          <label>Tên đơn vị: </label><input type="text" value={invoiceData.seller.company} onChange={(e) => handleInputChange('seller', 'company', e.target.value)} />
          <label>Địa chỉ: đường </label><input type="text" value={invoiceData.seller.address} onChange={(e) => handleInputChange('seller', 'address', e.target.value)} />
          <label>Điện thoại: </label><input type="text" value={invoiceData.seller.phone} onChange={(e) => handleInputChange('seller', 'phone', e.target.value)} />
          <label>Hình thức thanh toán: </label><input type="text" value={invoiceData.seller.paymentMethod} onChange={(e) => handleInputChange('seller', 'paymentMethod', e.target.value)} />
          <label>Số tài khoản: </label><input type="text" value={invoiceData.seller.accountNumber} onChange={(e) => handleInputChange('seller', 'accountNumber', e.target.value)} />
        </div>
      </div>
      <div className="second-content">
        <div className="section">
          <label>Họ tên người mua hàng:</label><input type="text" value={invoiceData.buyer.name} onChange={(e) => handleInputChange('buyer', 'name', e.target.value)} />
          <label>Tên đơn vị: </label><input type="text" value={invoiceData.buyer.company} onChange={(e) => handleInputChange('buyer', 'company', e.target.value)} />
          <label>Mã số thuế: </label><input type="text" value={invoiceData.buyer.taxCode} onChange={(e) => handleInputChange('buyer', 'taxCode', e.target.value)} />
          <label>Địa chỉ: </label><input type="text" value={invoiceData.buyer.address} onChange={(e) => handleInputChange('buyer', 'address', e.target.value)} />
          <label>Điện thoại: </label><input type="text" value={invoiceData.buyer.phone} onChange={(e) => handleInputChange('buyer', 'phone', e.target.value)} />
          <label>Hình thức thanh toán: </label><input type="text" value={invoiceData.buyer.paymentMethod} onChange={(e) => handleInputChange('buyer', 'paymentMethod', e.target.value)} />
          <label>Số tài khoản: </label><input type="text" value={invoiceData.buyer.accountNumber} onChange={(e) => handleInputChange('buyer', 'accountNumber', e.target.value)} />
        </div>
      </div>
      <div className="information-table">
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên hàng hóa, dịch vụ</th>
              <th>Số lượng</th>
              <th>Đơn giá</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td><input type="text" value={row.name} onChange={(e) => handleChange(index, 'name', e.target.value)} /></td>
                <td><input type="number" value={row.quantity} onChange={(e) => handleChange(index, 'quantity', e.target.value)} /></td>
                <td><input type="number" value={row.price} onChange={(e) => handleChange(index, 'price', e.target.value)} /></td>
                <td>{row.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="actions" onClick={handleAddRow}>Thêm hàng</button>
        <div className="total-content">
          <div className="totals">
            <label>Tổng tiền: </label><input type="text" value={invoiceData.totalAmount} readOnly />
          </div>
          <div className="total-input">
            <label>Số tiền viết bằng chữ: </label><input type="text" value={invoiceData.amountInWords} onChange={(e) => handleInputChange('amountInWords', '', e.target.value)} />
          </div>
        </div>
        <div className="actions">
          <button onClick={handlePrint}>In hóa đơn</button>
          <button onClick={handleExport}>Xuất hóa đơn</button>
        </div>
      </div>
      <div className="signatures">
        <div>Người mua hàng</div>
        <div>Người bán hàng</div>
      </div>
      {showPreview && (
        <div className="preview-modal">
          <div className="preview-content">
            <h2>Hóa đơn bán hàng</h2>
            <button onClick={handleSaveInvoice}>Lưu hóa đơn</button>
            <button onClick={handleClosePreview}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default InvoiceForm;
