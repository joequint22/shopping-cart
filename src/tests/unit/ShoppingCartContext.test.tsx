import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
 ShoppingCartProvider,
  useShoppingCart,
} from '../../context/ShoppingCartContext';
import { act } from 'react-dom/test-utils';



Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: unknown) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => {},
    })
  });
  
  // Mocking localStorage
  const localStorageMock: { [key: string]: string } = {};
  
  beforeAll(() => {
      const localStorageGetItem = jest.fn((key: string) => localStorageMock[key]);
      const localStorageSetItem = jest.fn((key: string, value: string) => {
          localStorageMock[key] = value;
        });
        Object.defineProperty(window, 'localStorage', {
            value: {
                getItem: localStorageGetItem,
                setItem: localStorageSetItem,
            },
            writable: true,
        });
    });
    
    const TestComponent: React.FC = () => {
        const { openCart, closeCart, cartItems, cartQuantity } = useShoppingCart();
        
        return (
            <>
      <button onClick={openCart}>Open Cart</button>
      <button onClick={closeCart}>Close Cart</button>
      <div data-testid="cart-quantity">{cartQuantity}</div>
      <div data-testid="cart-items">{JSON.stringify(cartItems)}</div>
    </>
  );
};



describe('ShoppingCartProvider', () => {
  it('provides context values', async () => {
    const { getByText, getByTestId } = render(
      <ShoppingCartProvider>
        <TestComponent />
      </ShoppingCartProvider>
    );

    const openCartButton = getByText('Open Cart');
    const closeCartButton = getByText('Close Cart');
    const cartQuantityElement = getByTestId('cart-quantity');
    const cartItemsElement = getByTestId('cart-items');

    expect(cartQuantityElement).toHaveTextContent('0');
    expect(cartItemsElement).toHaveTextContent('[]');

    fireEvent.click(openCartButton);
    fireEvent.click(closeCartButton);

    expect(cartQuantityElement).toHaveTextContent('0');
    expect(cartItemsElement).toHaveTextContent('[]');
  });

  it('updates context values on cart actions', async () => {
    const { getByText, getByTestId } = render(
        <ShoppingCartProvider>
          <TestComponent />
        </ShoppingCartProvider>
      );

    const openCartButton = getByText('Open Cart');
    const cartQuantityElement = getByTestId('cart-quantity');
    const cartItemsElement = getByTestId('cart-items');

    // Open cart
    fireEvent.click(openCartButton);

    // Add item to cart
    act(() => {
      useShoppingCart().increaseCartQuantity(1);
    });

    expect(cartQuantityElement).toHaveTextContent('1');
    expect(cartItemsElement).toHaveTextContent('[{"id":1,"quantity":1}]');

    // Decrease item quantity in cart
    act(() => {
      useShoppingCart().decreaseCartQuantity(1);
    });

    expect(cartQuantityElement).toHaveTextContent('0');
    expect(cartItemsElement).toHaveTextContent('[]');
  });
});