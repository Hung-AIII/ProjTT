import { defineStore } from 'pinia'
import axios from 'axios'

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [
      // === ÁO SƠ MI ===
      { id: 1, name: 'Áo sơ mi denim cao cấp', price: 450000, image: 'https://picsum.photos/seed/1/400/500', category: 'Áo sơ mi', description: 'Chất liệu denim cao cấp, phong cách hiện đại.' },
      { id: 2, name: 'Sơ mi trắng cổ đức', price: 410000, image: 'https://picsum.photos/seed/2/400/500', category: 'Áo sơ mi', description: 'Sơ mi trắng cổ đức lịch lãm, phù hợp công sở.' },
      { id: 3, name: 'Sơ mi kẻ sọc thanh lịch', price: 380000, image: 'https://picsum.photos/seed/3/400/500', category: 'Áo sơ mi', description: 'Họa tiết kẻ sọc tinh tế, chất vải mềm mại.' },
      { id: 4, name: 'Áo sơ mi linen trắng', price: 520000, image: 'https://picsum.photos/seed/4/400/500', category: 'Áo sơ mi', description: 'Chất liệu linen thoáng mát, sang trọng.' },
      { id: 5, name: 'Sơ mi họa tiết chấm bi', price: 360000, image: 'https://picsum.photos/seed/5/400/500', category: 'Áo sơ mi', description: 'Họa tiết chấm bi vintage, phong cách retro.' },
      
      // === ÁO THUN ===
      { id: 6, name: 'Áo thun cotton premium', price: 220000, image: 'https://picsum.photos/seed/6/400/500', category: 'Áo thun', description: 'Cotton 100%, mềm mại, thoáng khí.' },
      { id: 7, name: 'Áo thun polo cao cấp', price: 320000, image: 'https://picsum.photos/seed/7/400/500', category: 'Áo thun', description: 'Polo cổ bẻ, chất liệu pique cao cấp.' },
      { id: 8, name: 'Áo thun graphic vintage', price: 250000, image: 'https://picsum.photos/seed/8/400/500', category: 'Áo thun', description: 'In hình vintage độc đáo, phong cách streetwear.' },
      { id: 9, name: 'Áo thun tay lỡ basic', price: 190000, image: 'https://picsum.photos/seed/9/400/500', category: 'Áo thun', description: 'Basic tay lỡ, dễ phối đồ, chất vải dày dặn.' },
      { id: 10, name: 'Áo thun oversize unisex', price: 270000, image: 'https://picsum.photos/seed/10/400/500', category: 'Áo thun', description: 'Phong cách oversize, phù hợp cả nam và nữ.' },
      
      // === ÁO KHOÁC ===
      { id: 11, name: 'Áo khoác da bò cao cấp', price: 1250000, image: 'https://picsum.photos/seed/11/400/500', category: 'Áo khoác', description: 'Da bò thật, bền đẹp theo thời gian.' },
      { id: 12, name: 'Áo khoác bomber jacket', price: 890000, image: 'https://picsum.photos/seed/12/400/500', category: 'Áo khoác', description: 'Bomber jacket phong cách quân đội, ấm áp.' },
      { id: 13, name: 'Áo khoác trench coat', price: 1450000, image: 'https://picsum.photos/seed/13/400/500', category: 'Áo khoác', description: 'Trench coat thanh lịch, phù hợp mùa thu.' },
      { id: 14, name: 'Áo khoác denim jacket', price: 650000, image: 'https://picsum.photos/seed/14/400/500', category: 'Áo khoác', description: 'Áo khoác denim cá tính, phong cách trẻ trung.' },
      { id: 15, name: 'Áo khoác lông cừu', price: 980000, image: 'https://picsum.photos/seed/15/400/500', category: 'Áo khoác', description: 'Lông cừu ấm áp, sang trọng và thời thượng.' },
      
      // === ÁO LEN ===
      { id: 16, name: 'Áo len cổ lọ cao cấp', price: 480000, image: 'https://picsum.photos/seed/16/400/500', category: 'Áo len', description: 'Len cao cấp, ấm áp, thanh lịch.' },
      { id: 17, name: 'Áo len cardigan mỏng', price: 420000, image: 'https://picsum.photos/seed/17/400/500', category: 'Áo len', description: 'Cardigan mỏng nhẹ, dễ dàng phối đồ.' },
      { id: 18, name: 'Áo len họa tiết Scandinavian', price: 550000, image: 'https://picsum.photos/seed/18/400/500', category: 'Áo len', description: 'Họa tiết Bắc Âu truyền thống, ấm áp.' },
      { id: 19, name: 'Áo len cổ tròn basic', price: 350000, image: 'https://picsum.photos/seed/19/400/500', category: 'Áo len', description: 'Cổ tròn basic, phối được nhiều kiểu.' },
      { id: 20, name: 'Áo len turtle neck', price: 510000, image: 'https://picsum.photos/seed/20/400/500', category: 'Áo len', description: 'Cổ lọ cao cấp, phong cách châu Âu.' },
      
      // === VÁY ===
      { id: 21, name: 'Váy đen thanh lịch', price: 680000, image: 'https://picsum.photos/seed/21/400/500', category: 'Váy', description: 'Váy đen tối giản, sang trọng cho mọi dịp.' },
      { id: 22, name: 'Váy hoa nhí nữ tính', price: 560000, image: 'https://picsum.photos/seed/22/400/500', category: 'Váy', description: 'Hoa nhí ngọt ngào, chất liệu bay bổng.' },
      { id: 23, name: 'Váy midi xếp ly', price: 490000, image: 'https://picsum.photos/seed/23/400/500', category: 'Váy', description: 'Xếp ly tinh tế, phong cách thanh lịch.' },
      { id: 24, name: 'Váy maxi dáng dài', price: 720000, image: 'https://picsum.photos/seed/24/400/500', category: 'Váy', description: 'Váy dài thướt tha, bay bổng và sang trọng.' },
      { id: 25, name: 'Váy bodycon ôm dáng', price: 610000, image: 'https://picsum.photos/seed/25/400/500', category: 'Váy', description: 'Ôm dáng gợi cảm, tôn lên vẻ đẹp hình thể.' },
      
      // === QUẦN ===
      { id: 26, name: 'Quần âu nam công sở', price: 520000, image: 'https://picsum.photos/seed/26/400/500', category: 'Quần', description: 'Quần âu form chuẩn, chất vải cao cấp.' },
      { id: 27, name: 'Quần jean skinny nam', price: 450000, image: 'https://picsum.photos/seed/27/400/500', category: 'Quần', description: 'Jeans skinny, phong cách trẻ trung, năng động.' },
      { id: 28, name: 'Quần jogger thể thao', price: 310000, image: 'https://picsum.photos/seed/28/400/500', category: 'Quần', description: 'Jogger thoải mái, phong cách thể thao năng động.' },
      { id: 29, name: 'Quần tây nữ ống suông', price: 480000, image: 'https://picsum.photos/seed/29/400/500', category: 'Quần', description: 'Ống suông thanh lịch, phù hợp công sở.' },
      { id: 30, name: 'Quần short denim nữ', price: 280000, image: 'https://picsum.photos/seed/30/400/500', category: 'Quần', description: 'Short denim trẻ trung, cá tính cho mùa hè.' },
      
      // === CHÂN VÁY ===
      { id: 31, name: 'Chân váy midi xếp ly', price: 350000, image: 'https://picsum.photos/seed/31/400/500', category: 'Chân váy', description: 'Xếp ly thanh lịch, phong cách nữ tính.' },
      { id: 32, name: 'Chân váy bút chì công sở', price: 420000, image: 'https://picsum.photos/seed/32/400/500', category: 'Chân váy', description: 'Bút chì ôm dáng, sang trọng cho văn phòng.' },
      { id: 33, name: 'Chân váy xòe jean', price: 380000, image: 'https://picsum.photos/seed/33/400/500', category: 'Chân váy', description: 'Xòe jean phong cách retro, trẻ trung.' },
      { id: 34, name: 'Chân váy tennis trắng', price: 290000, image: 'https://picsum.photos/seed/34/400/500', category: 'Chân váy', description: 'Phong cách tennis năng động, trẻ trung.' },
      { id: 35, name: 'Chân váy da đen', price: 460000, image: 'https://picsum.photos/seed/35/400/500', category: 'Chân váy', description: 'Chất da bóng, phong cách cá tính và sang trọng.' },
      
      // === ÁO HOODIE ===
      { id: 36, name: 'Áo hoodie unisex', price: 390000, image: 'https://picsum.photos/seed/36/400/500', category: 'Áo hoodie', description: 'Hoodie ấm áp, phong cách streetwear.' },
      { id: 37, name: 'Hoodie cổ trễ oversized', price: 450000, image: 'https://picsum.photos/seed/37/400/500', category: 'Áo hoodie', description: 'Oversized cổ trễ, phong cách K-pop.' },
      { id: 38, name: 'Hoodie zip-up basic', price: 410000, image: 'https://picsum.photos/seed/38/400/500', category: 'Áo hoodie', description: 'Basic zip-up, dễ dàng mặc hằng ngày.' },
      { id: 39, name: 'Hoodie họa tiết vintage', price: 470000, image: 'https://picsum.photos/seed/39/400/500', category: 'Áo hoodie', description: 'Họa tiết vintage độc đáo.' },
      
      // === ÁO BLAZER ===
      { id: 40, name: 'Áo blazer nữ công sở', price: 790000, image: 'https://picsum.photos/seed/40/400/500', category: 'Áo blazer', description: 'Blazer nữ phong cách công sở, sang trọng.' },
      { id: 41, name: 'Blazer nam form chuẩn', price: 850000, image: 'https://picsum.photos/seed/41/400/500', category: 'Áo blazer', description: 'Blazer nam form chuẩn, lịch lãm và sang trọng.' },
      { id: 42, name: 'Blazer cổ ve chéo', price: 920000, image: 'https://picsum.photos/seed/42/400/500', category: 'Áo blazer', description: 'Cổ ve chéo phong cách châu Âu.' },
      
      // === ÁO THỂ THAO ===
      { id: 43, name: 'Áo tập gym thể thao', price: 210000, image: 'https://picsum.photos/seed/43/400/500', category: 'Áo thể thao', description: 'Chất vải thấm hút mồ hôi, thoải mái vận động.' },
      { id: 44, name: 'Áo chạy bộ nam', price: 230000, image: 'https://picsum.photos/seed/44/400/500', category: 'Áo thể thao', description: 'Thoáng khí, nhẹ nhàng cho mọi hoạt động.' },
      { id: 45, name: 'Áo yoga nữ', price: 260000, image: 'https://picsum.photos/seed/45/400/500', category: 'Áo thể thao', description: 'Chất vải co giãn 4 chiều, thoải mái tập luyện.' },
      
      // === ĐỒ NGỦ ===
      { id: 46, name: 'Bộ đồ ngủ satin cao cấp', price: 590000, image: 'https://picsum.photos/seed/46/400/500', category: 'Đồ ngủ', description: 'Chất satin mềm mại, sang trọng, thoải mái.' },
      { id: 47, name: 'Áo ngủ cotton mềm', price: 320000, image: 'https://picsum.photos/seed/47/400/500', category: 'Đồ ngủ', description: 'Cotton 100%, mềm mại, dễ chịu cho giấc ngủ.' },
      
      // === PHỤ KIỆN ===
      { id: 48, name: 'Khăn quàng cổ cashmere', price: 420000, image: 'https://picsum.photos/seed/48/400/500', category: 'Phụ kiện', description: 'Cashmere cao cấp, ấm áp và sang trọng.' },
      { id: 49, name: 'Găng tay da', price: 350000, image: 'https://picsum.photos/seed/49/400/500', category: 'Phụ kiện', description: 'Da thật, tinh tế và bền bỉ.' },
      { id: 50, name: 'Mũ fedora thanh lịch', price: 290000, image: 'https://picsum.photos/seed/50/400/500', category: 'Phụ kiện', description: 'Mũ fedora phong cách cổ điển, sang trọng.' }
    ],
    loading: false,
    error: null,
  }),

  getters: {
    getProductById: (state) => (id) => {
      return state.products.find(product => product.id === id)
    },
  },

  actions: {
async fetchProducts() {
  this.loading = true
  this.error = null
  try {
    const response = await axios.get('/api/products')
    this.products = response.data
  } catch (error) {
    this.error = 'Không thể tải sản phẩm'
  } finally {
    this.loading = false
  }
},

    async fetchProductById(id) {
      this.loading = true
      this.error = null
      try {
        await new Promise(resolve => setTimeout(resolve, 300))
        return this.getProductById(id) || null
      } catch (error) {
        this.error = 'Không thể tải sản phẩm'
        return null
      } finally {
        this.loading = false
      }
    },

    async createProduct(productData) {
      try {
        this.products.push({ ...productData, id: Date.now() })
        return { success: true }
      } catch (error) {
        return { success: false, message: 'Thêm sản phẩm thất bại' }
      }
    },

    async updateProduct(id, productData) {
      try {
        const index = this.products.findIndex(p => p.id === id)
        if (index !== -1) {
          this.products[index] = { ...this.products[index], ...productData }
        }
        return { success: true }
      } catch (error) {
        return { success: false, message: 'Cập nhật sản phẩm thất bại' }
      }
    },

    async deleteProduct(id) {
      try {
        this.products = this.products.filter(p => p.id !== id)
        return { success: true }
      } catch (error) {
        return { success: false, message: 'Xóa sản phẩm thất bại' }
      }
    },
  }
})