

import { formatCurrency } from "../utilities/formatCurrency";


describe('USD currency converter', () => {

    it('should convert to $10.00', () => {
        // arrange: 
        const expected = "$10.00"
        const result = formatCurrency(10)

        // assert:
        expect(result).toBe(expected)
    })
})