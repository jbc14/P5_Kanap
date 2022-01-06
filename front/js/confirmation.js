function getOrderId() {
  return new URL(location.href).searchParams.get("orderid");
}

const orderId = getOrderId();
document.getElementById("orderId").innerText = `${orderId}`;
