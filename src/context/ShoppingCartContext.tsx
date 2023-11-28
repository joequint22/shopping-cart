import { ReactNode, createContext, useContext, useState } from "react"
import { ShoppingCart } from "../components/ShoppingCart"
import { useLocalStorage } from "../hooks/useLocalStorage"

export type ShoppingCartProviderProps = {
    children: ReactNode
}

type CartItem = {
    id: number
    quantity: number
}

export type TShoppingCartContext = {
    openCart: () => void
    closeCart: () => void 
    getItemQuantity: (id: number) => number
    increaseCartQuantity: (id: number) => void
    decreaseCartQuantity: (id: number) => void
    removeFromCart: (id: number) => void
    cartQuantity: number
    cartItems: CartItem[]

}

const ShoppingCartContext =  createContext({} as TShoppingCartContext) 

export function useShoppingCart(){
    return useContext(ShoppingCartContext)
}


// implements the provider portion, providing all thevalues i need
export function ShoppingCartProvider( { children }: ShoppingCartProviderProps){

    const [isOpen, setIsOpen] = useState(false)
    const [cartItems, setCartItems] = useLocalStorage<CartItem[]>('shopping-cart', [])
    const cartQuantity = cartItems.reduce((sum, value) => sum + value.quantity, 0)
    const openCart = () => setIsOpen(true) 
    const closeCart = () => setIsOpen(false) 


    function getItemQuantity(id: number){
        // if elements match return the quantitiy, else return 0 
        return cartItems.find(item => item.id === id )?.quantity || 0
    }
    function increaseCartQuantity(id: number){
        // set cart items to the previous cart and layout the scenarios of adding a cart...  1) new item   or   2) previous item
        // if you cant find the item, we return a falsey value ... that information we can use 
        // else, if it finds a MATCH then increases quantity by one... else. prevent any other possibilities from happening by just returning the item itself 
    
        setCartItems(currItems => {
            if(currItems.find(item => item.id === id) == null){
                return [...currItems, { id, quantity: 1 }]
            } else {
                return currItems.map(item => {
                    if (item.id === id){
                        return { ...item, quantity: item.quantity + 1}
                    } else {
                        return item
                    }
                })
            }
        })
    }
    function decreaseCartQuantity(id: number){
        // set the carts to the previous cart and lay out the scenarios... 
            // 1) if you find the MATCH, check if the item's quantity equals one on one line of code... 
                // filter it out like a wanted poster–– if you dont look like this guy's ID, you can pass through
                // else, iterate through the list until you find a MATCH and increase that ID match's quantity by one
        setCartItems(currItems => {
            if(currItems.find(item => item.id === id)?.quantity === 1){
                return currItems.filter(item => item.id !== id )
            } else {
                return currItems.map(item => {
                    if (item.id === id){
                        return { ...item, quantity: item.quantity - 1}
                    } else {
                        return item
                    }
                })
            }
        })
    }
    function removeFromCart(id: number){
        setCartItems(currItems => {
            // filter out the id's that MATCH the id given.. meaning filter rule's start with "CANT"
            return currItems.filter(item => item.id !== id)
        })
    }



    return (
        <>
            <ShoppingCartContext.Provider 
                value={{ 
                    getItemQuantity, 
                    increaseCartQuantity, 
                    decreaseCartQuantity, 
                    removeFromCart,
                    openCart,
                    closeCart,
                    cartItems,
                    cartQuantity
                    }}>
                {children}
                <ShoppingCart isOpen={isOpen}/>
            </ShoppingCartContext.Provider>
        </>
    )
}