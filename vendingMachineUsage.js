const vendingMachineUsage = class {
  constructor({ stockManager }) {
    this.stockManager = stockManager;
    this.change = 0;
    this.itemNo = 0;
    this.itemList = [];
    this.itemNoList = [];
  }

  insertCoin(coin) {
    if (coin === 50000) {
      console.log('유효하지 않은 화폐입니다.');
      this.change = false;
    } else if (coin === 10) {
      console.log('유효하지 않은 화폐입니다.');
      this.change = false;
    } else if (typeof coin === 'number') {
      console.log(`투입 금액: ${coin}원`);
      this.change += coin;
      console.log(`현재 잔액: ${this.change}원`);
      this.showAvailableItemList(this.change);
    } else if (coin === '카드') {
      this.change = 100000;
      this.showAvailableItemList(this.change);
    }
  }

  selectItem(itemNo, quantity) {
    this.checkStock(itemNo, quantity);
    this.showAvailableItemList(this.change);
  }

  returnChange() {
    const returnedChange = this.change;
    if (returnedChange !== false) {
      this.change = 0;
      console.log(`잔액 ${returnedChange}원이 반환되었습니다.`);
    }
  }

  checkStock(itemNo, quantity) {
    this.itemList.forEach(val => {
      if (val.itemNo === itemNo && val.stock >= quantity) {
        val.stock = this.handleOrder(
          quantity,
          val.price,
          val.itemName,
          val.stock
        );
        val.outOfStock = this.checkOutOfStock(val.stock, val.outOfStock);
      } else if (val.itemNo === itemNo && val.stock === 0) {
        console.log(
          `선택한 상품(${val.itemName})은 매진되었습니다. 다른 제품을 선택해주세요.`
        );
      } else if (
        val.itemNo === itemNo &&
        val.stock !== 0 &&
        val.stock < quantity
      ) {
        console.log(
          `선택한 상품(${val.itemName})의 재고가 부족합니다. 구매 수량을 변경해주세요.`
        );
      }
    });
  }

  handleOrder(quantity, price, itemName, stock) {
    const totalPrice = price * quantity;
    if (this.change === false) {
      return;
    } else if (totalPrice <= this.change) {
      this.change -= totalPrice;
      stock -= quantity;
      console.log(
        `선택한 '${itemName}' ${quantity}개가 나왔습니다. 현재 잔액 ${this.change}원`
      );
      return stock;
    } else if (totalPrice > this.change || this.change === 0) {
      console.log(`잔액이 부족합니다.`);
    }
  }

  checkOutOfStock(stock, outOfStock) {
    if (stock === 0) {
      outOfStock = '매진';
    }
    return outOfStock;
  }

  showAvailableItemList(insertedCoin) {
    if (this.change !== false) {
      const availableItemList = this.itemList.filter(
        val => val.price <= insertedCoin
      );
      if (availableItemList.length === 0) {
        console.log(`현재 잔액으로 추가 선택 가능한 상품이 없습니다.`);
      } else {
        availableItemList.sort(function (a, b) {
          return a.itemNo - b.itemNo;
        });
        console.log(`=====제품을 선택해주세요.=====`);
        availableItemList.forEach(val =>
          console.log(
            `번호: ${val.itemNo}, 제품명: ${val.itemName}, 가격: ${val.price}원 (${val.outOfStock})`
          )
        );
      }
    }
  }
};

const vendingMachineStockManagement = class {
  registerNewItem(itemName, quantity, price) {
    const itemNoLimit = 3;
    const itemNo = this.assignItemNo(itemNoLimit);
    if (!itemNo) return;
    const newItemInfo = this.composeItemInfo(itemNo, itemName, quantity, price);
    vmManager.itemList.push(newItemInfo);
    console.log(
      `'${newItemInfo.itemName}'(${newItemInfo.price}원) ${newItemInfo.stock}개가 ${newItemInfo.itemNo}번 품목에 등록되었습니다.`
    );
  }

  assignItemNo() {
    if (vmManager.length !== 0) {
      vmManager.itemNoList.push(++vmManager.itemNo);
      return vmManager.itemNo;
    }
  }

  composeItemInfo(itemNo, itemName, quantity, price) {
    const itemInfo = {
      itemNo: itemNo,
      itemName: itemName,
      stock: quantity,
      price: price,
      outOfStock: undefined,
    };
    itemInfo.stock > 0
      ? (itemInfo.outOfStock = '판매중')
      : itemInfo.stock == 0
      ? (itemInfo.outOfStock = '매진')
      : undefined;
    return itemInfo;
  }

  updateStock(itemNo, quantity) {
    vmManager.itemList.forEach(val => {
      if (val.itemNo === itemNo) {
        val.stock = quantity;
        val.stock > 0
          ? (val.outOfStock = '판매중')
          : val.stock == 0
          ? (val.outOfStock = '매진')
          : undefined;
        console.log(
          `${val.itemNo}번 품목(${val.itemName})의 재고가 ${val.stock}개로 변경되었습니다.)`
        );
      }
    });
  }
};

const vmManager = new vendingMachineUsage({
  stockManager: new vendingMachineStockManagement(),
});

vmManager.stockManager.registerNewItem('콜라', 1, 1100);
vmManager.stockManager.registerNewItem('물', 8, 600);
vmManager.stockManager.registerNewItem('커피', 3, 700);
