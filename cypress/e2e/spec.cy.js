/// <reference types='cypress' />
Cypress.on('uncaught:exception', (err, runnable) => { return false; });

describe('Pecode Test task Rozetka', () => {
  beforeEach(() => {
    cy.visit('/')
  });

  it('Verify if the price filter working correctly', () => {
    cy.url().should('eq', 'https://rozetka.com.ua/ua/');

    cy.get('#fat-menu')
      .click()
    cy.contains('.menu__link', 'Apple Macbook')
      .click();

    // Apply price filters
    cy.setMinMaxPrices(39999, 100000)

    cy.get('.goods-tile')
      .should('be.visible');

    // Verify that all items on the page are sorted correctly by price filters
    cy.checkPriceFilterIsWorking(39999, 100000)
  });

  it('Add items to the basket', () => {
    cy.url().should('eq', 'https://rozetka.com.ua/ua/');

    cy.get('#fat-menu')
      .click()
    cy.contains('.menu__link', 'Apple Macbook')
      .click();

    // Add an item to the basket
    cy.get('.goods-tile', { timeout: 10000 })
      .first()
      .within(() => {
        cy.get('.buy-button').click();
      });

    // Select another category
    cy.contains('button', 'Скасувати').click();

    cy.contains('.checkbox-filter__link', 'HP')
      .click({ timeout: 10000 });

    // Add another item to the basket
    cy.get('.goods-tile')
      .first()
      .within(() => {
        cy.get('.buy-button').click({ timeout: 10000 });
      });

    // Open shoping cart
    cy.get('.header-actions__item--cart')
      .click()


    // Verify information of items inside the basket
    cy.get('.cart-list__item')
      .should('have.length', 2)
      .each((cartItem) => {
        cy.wrap(cartItem)
          .find('.cart-product__title')
          .should('be.visible');

        cy.wrap(cartItem)
          .find('.cart-product__price')
          .should('be.visible');

        cy.wrap(cartItem)
          .find('.cart-counter__input')
          .should('be.visible')
          .should('have.value', '1');
      });

    // Verify that the price is calculated correctly
    cy.calculateTotalPrice(59998)

    // Verify that the delete item button is clickable
    cy.get('.popup-menu__toggle')
      .click({ multiple: true })
    cy.contains('button', ' Видалити ')
      .each((cartItem) => {
        cy.wrap(cartItem)
          .should('be.visible')
          .should('be.enabled');
      });

  });

  it('Search the item', () => {
    cy.url().should('eq', 'https://rozetka.com.ua/ua/');

    cy.checkContainsSearchInput('Samsung')
    cy.checkContainsSearchInput('ASUS').wait(5000)
    cy.checkContainsSearchInput('Iphone').wait(5000)
  });

  it('Add items to compeare list', () => {
    cy.url().should('eq', 'https://rozetka.com.ua/ua/');

    cy.get('#fat-menu')
      .click()
    cy.contains('.menu__link', 'Apple Macbook')
      .click();

    cy.get('.compare-button', { timeout: 10000 })
      .eq(0)
      .click();

    // Wait for the item to be added to the compare list
    cy.get('button[aria-label="Списки порівнянь"]').should('be.visible');

    // Add the second item to the compare list
    cy.get('.compare-button')
      .eq(1)
      .click();

    // Go to the comare list page
    cy.get('button[aria-label="Списки порівнянь"]').click();
    cy.contains('.comparison-modal__link', ' Ноутбуки ').click({ timeout: 10000 });

    // Verify the information of items inside the compare list
    cy.get('.products-grid__cell', { timeout: 10000 }).should('have.length', 2).each((itemElement) => {
      cy.wrap(itemElement)
        .find('.product__heading')
        .should('be.visible')
        .invoke('text')
        .then((titleText) => {
          expect(titleText.trim()).to.not.be.empty;
        });

      cy.wrap(itemElement)
        .find('.product__prices')
        .should('be.visible')
        .invoke('text')
        .then((priceText) => {
          expect(priceText.trim()).to.not.be.empty;
        });
      // Verify that the delete item button is clickable
      cy.get('.popup-menu__toggle')
        .click({ multiple: true })
      cy.contains('button', ' Видалити ')
        .each((cartItem) => {
          cy.wrap(cartItem)
            .should('be.visible')
            .should('be.enabled');
        });
      
        // Verify that comare list have all characteristic sections
      cy.getCharacteristicSection(' Продавець ');
      cy.getCharacteristicSection(' Екран ');
      cy.getCharacteristicSection(' Накопичувачі даних ');
      cy.getCharacteristicSection(' Процесор ');
      cy.getCharacteristicSection(" Оперативна пам'ять ");
      cy.getCharacteristicSection(' Підключення ');
      cy.getCharacteristicSection(' Корпус ');
      cy.getCharacteristicSection(' Характеристики ');
    });
  });
});