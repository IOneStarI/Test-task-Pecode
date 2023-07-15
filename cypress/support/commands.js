Cypress.Commands.add('checkContainsSearchInput', (searchInput) => {
  cy.get('.search-form__input')
    .clear()
    .type(searchInput);

  cy.get('.search-form__submit')
    .click();

  cy.get('.goods-tile')
    .should('be.visible')
    .each((tileElement, index) => {
    if (index < 20) {
      cy.wrap(tileElement)
        .find('.goods-tile__title')
        .should('be.visible')
        .invoke('text')
        .then((titleText) => {
          expect(titleText.toLowerCase()).to.include(searchInput.toLowerCase());
        });
    }
    });
});

Cypress.Commands.add('getCharacteristicSection', (characteristicName) => {
  cy.contains('button', `${characteristicName}`)
    .should('be.visible');
});

Cypress.Commands.add('setMinMaxPrices', (minPrice, maxPrice) => {
  cy.get('input[formcontrolname="min"]', { timeout: 6000 })
      .clear()
      .type(`${minPrice}`)
  cy.get('input[formcontrolname="max"]', { timeout: 6000 })
      .clear()
      .type(`${maxPrice}`)
    cy.get('.slider-filter__button')
      .click({ timeout: 6000 });
});

Cypress.Commands.add('checkPriceFilterIsWorking', (minPrice, maxPrice) => {
  cy.get('.goods-tile__price-value').each((priceElement) => {
    const price = parseInt(priceElement.text().replace(/[^\d]/g, ''), 10);
    expect(price).to.be.gte(minPrice);
    expect(price).to.be.lte(maxPrice);
  });
});

Cypress.Commands.add('calculateTotalPrice', (exectedPrice) => {
  cy.get('.cart-receipt__sum-price')
  .then((totalPriceElement) => {
    const totalPrice = parseInt(totalPriceElement.text().replace(/[^\d.-]/g, ''));

    let expectedTotalPrice = exectedPrice

    cy.get('.cart-list__item').each((cartItem) => {
      const itemPrice = parseInt(cartItem.find('.cart-product__price').text().replace(/[^\d.-]/g, ''));
      const itemQuantity = parseInt(cartItem.find('.cart-counter__input').val(), 10);


      const itemTotalPrice = itemPrice * itemQuantity;
      expectedTotalPrice += itemTotalPrice;
    });

    expect(totalPrice).to.eq(expectedTotalPrice);
  });
});