<template>
  <div class="p-6 pt-24">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold text-light tracking-wider">📦 Quản lý sản phẩm</h1>
      <button @click="openAddModal" class="bg-gold text-dark px-4 py-2 rounded hover:bg-goldHover transition-all font-semibold">+ Thêm mới</button>
    </div>

    <div class="grid grid-cols-3 gap-4 mt-4">
      <div class="bg-dark3/80 border border-white/5 rounded-lg p-4">
        <p class="text-muted text-xs uppercase tracking-wider">Tổng sản phẩm</p>
        <p class="text-2xl font-bold text-light mt-1">{{ productsStore.products.length }}</p>
      </div>
      <div class="bg-dark3/80 border border-white/5 rounded-lg p-4">
        <p class="text-muted text-xs uppercase tracking-wider">Sắp hết hàng</p>
        <p class="text-2xl font-bold text-yellow-400 mt-1">{{ lowStockCount }}</p>
      </div>
      <div class="bg-dark3/80 border border-white/5 rounded-lg p-4">
        <p class="text-muted text-xs uppercase tracking-wider">Hết hàng</p>
        <p class="text-2xl font-bold text-red-500 mt-1">{{ outOfStockCount }}</p>
      </div>
    </div>

    <div class="bg-dark3/80 backdrop-blur-lg border border-white/5 rounded-lg overflow-hidden mt-6">
      <table class="w-full">
        <thead class="bg-white/5">
          <tr>
            <th class="text-left text-muted text-sm uppercase tracking-wider px-4 py-3">ID</th>
            <th class="text-left text-muted text-sm uppercase tracking-wider px-4 py-3">Tên</th>
            <th class="text-left text-muted text-sm uppercase tracking-wider px-4 py-3">Danh mục</th>
            <th class="text-left text-muted text-sm uppercase tracking-wider px-4 py-3">Giá</th>
            <th class="text-left text-muted text-sm uppercase tracking-wider px-4 py-3">Tồn kho</th>
            <th class="text-left text-muted text-sm uppercase tracking-wider px-4 py-3">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="productsStore.loadingList">
            <td colspan="6" class="text-center text-muted italic py-8">Đang tải...</td>
          </tr>
          <template v-else>
            <tr v-for="product in productsStore.products" :key="product._id || product.id"
                class="border-t border-white/5 hover:bg-white/5 transition">
              <td class="px-4 py-3 text-muted text-sm">#{{ product._id?.slice(-6) || product.id }}</td>
              <td class="px-4 py-3 text-light font-medium">{{ product.name }}</td>
              <td class="px-4 py-3 text-muted">{{ product.category }}</td>
              <td class="px-4 py-3 text-gold font-semibold">{{ formatPrice(product.price) }}</td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <span class="font-bold text-sm" :class="{
                    'text-green-400': product.stock > 10,
                    'text-yellow-400': product.stock > 0 && product.stock <= 10,
                    'text-red-500': product.stock <= 0
                  }">{{ product.stock ?? 0 }}</span>
                  <span v-if="product.stock <= 0" class="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">Hết</span>
                  <span v-else-if="product.stock <= 10" class="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">Thấp</span>
                  <button @click="openStockModal(product)"
                          class="text-xs text-gold hover:text-goldHover border border-gold/30 hover:border-gold px-2 py-0.5 rounded transition">
                    ✏ Sửa
                  </button>
                </div>
              </td>
              <td class="px-4 py-3">
                <button @click="openEditModal(product)" class="text-gold hover:text-goldHover transition mr-3">✎</button>
                <button @click="deleteProduct(product._id || product.id)" class="text-red-500 hover:text-red-400 transition">✕</button>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- MODAL THÊM / SỬA SẢN PHẨM -->
    <div v-if="showModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" @click.self="closeModal">
      <div class="bg-dark2 border border-white/10 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 class="text-2xl font-bold text-light mb-4">{{ isEditing ? '✎ Sửa sản phẩm' : '➕ Thêm sản phẩm mới' }}</h2>
        <form @submit.prevent="saveProduct" class="space-y-4">
          <div>
            <label class="block text-muted text-sm font-semibold mb-1">Tên sản phẩm *</label>
            <input type="text" v-model="form.name" required placeholder="Nhập tên sản phẩm"
                   class="w-full bg-dark3 border border-white/10 rounded-lg px-4 py-2 text-light focus:border-gold focus:outline-none" />
          </div>
          <div>
            <label class="block text-muted text-sm font-semibold mb-1">Giá (VNĐ) *</label>
            <input type="number" v-model="form.price" required min="0" placeholder="0"
                   class="w-full bg-dark3 border border-white/10 rounded-lg px-4 py-2 text-light focus:border-gold focus:outline-none" />
          </div>
          <div>
            <label class="block text-muted text-sm font-semibold mb-1">Danh mục *</label>
            <input type="text" v-model="form.category" required placeholder="Ví dụ: Áo sơ mi, Váy, Quần..."
                   class="w-full bg-dark3 border border-white/10 rounded-lg px-4 py-2 text-light focus:border-gold focus:outline-none" />
          </div>
          <div>
            <label class="block text-muted text-sm font-semibold mb-1">Link ảnh</label>
            <input type="text" v-model="form.image" placeholder="https://... hoặc /images/products/1.jpg"
                   class="w-full bg-dark3 border border-white/10 rounded-lg px-4 py-2 text-light focus:border-gold focus:outline-none" />
            <img v-if="form.image" :src="form.image"
                 class="mt-2 w-20 h-20 object-cover rounded border border-white/10"
                 @error="$event.target.style.display='none'" />
          </div>
          <div>
            <label class="block text-muted text-sm font-semibold mb-1">Mô tả</label>
            <textarea v-model="form.description" rows="3" placeholder="Mô tả ngắn về sản phẩm..."
                      class="w-full bg-dark3 border border-white/10 rounded-lg px-4 py-2 text-light focus:border-gold focus:outline-none resize-none"></textarea>
          </div>
          <div>
            <label class="block text-muted text-sm font-semibold mb-1">Tồn kho ban đầu</label>
            <input type="number" v-model="form.stock" min="0"
                   class="w-full bg-dark3 border border-white/10 rounded-lg px-4 py-2 text-light focus:border-gold focus:outline-none" />
          </div>
          <div class="flex gap-3 pt-2">
            <button type="button" @click="closeModal"
                    class="flex-1 bg-white/10 text-light py-2 rounded hover:bg-white/20 transition">Hủy</button>
            <button type="submit" :disabled="productsStore.loadingAction"
                    class="flex-1 bg-gold text-dark py-2 rounded hover:bg-goldHover transition font-semibold disabled:opacity-50">
              {{ productsStore.loadingAction ? 'Đang xử lý...' : (isEditing ? 'Cập nhật' : 'Thêm mới') }}
            </button>
          </div>
        </form>
        <p v-if="error" class="text-red-500 text-center text-sm mt-3">{{ error }}</p>
        <p v-if="success" class="text-green-500 text-center text-sm mt-3">{{ success }}</p>
      </div>
    </div>

    <!-- MODAL SỬA TỒN KHO -->
    <div v-if="showStockModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50" @click.self="showStockModal = false">
      <div class="bg-dark2 border border-white/10 rounded-lg p-6 w-80">
        <h3 class="text-xl font-bold text-light mb-1">✏ Cập nhật tồn kho</h3>
        <p class="text-muted text-sm mb-1">{{ stockEditProduct?.name }}</p>
        <p class="text-xs text-muted mb-4">
          Tồn kho hiện tại:
          <span class="font-bold" :class="{
            'text-green-400': stockEditProduct?.stock > 10,
            'text-yellow-400': stockEditProduct?.stock > 0 && stockEditProduct?.stock <= 10,
            'text-red-500': stockEditProduct?.stock <= 0
          }">{{ stockEditProduct?.stock ?? 0 }}</span>
        </p>
        <label class="block text-muted text-sm font-semibold mb-1">Số lượng mới</label>
        <input type="number" v-model="newStock" min="0"
               class="w-full bg-dark3 border border-white/10 rounded-lg px-4 py-2 text-light focus:border-gold focus:outline-none text-lg font-bold" />
        <div class="flex gap-2 mt-3">
          <button v-for="n in [5, 10, 20, 50]" :key="n"
                  @click="newStock = Number(newStock) + n"
                  class="flex-1 bg-white/5 border border-white/10 text-muted text-xs py-1 rounded hover:border-gold hover:text-gold transition">
            +{{ n }}
          </button>
        </div>
        <p v-if="stockError" class="text-red-500 text-sm mt-2">{{ stockError }}</p>
        <div class="flex gap-3 mt-4">
          <button @click="showStockModal = false"
                  class="flex-1 bg-white/10 text-light py-2 rounded hover:bg-white/20 transition">Hủy</button>
          <button @click="saveStock" :disabled="stockLoading"
                  class="flex-1 bg-gold text-dark py-2 rounded hover:bg-goldHover transition font-semibold disabled:opacity-50">
            {{ stockLoading ? 'Đang lưu...' : 'Lưu' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProductsStore } from '../../stores/products'

const productsStore = useProductsStore()

const showModal = ref(false)
const isEditing = ref(false)
const error = ref('')
const success = ref('')
const editingId = ref(null)

const form = ref({
  name: '', price: 0, image: '', category: '', description: '', stock: 10
})

const showStockModal = ref(false)
const stockEditProduct = ref(null)
const newStock = ref(0)
const stockLoading = ref(false)
const stockError = ref('')

const lowStockCount = computed(() =>
  productsStore.products.filter(p => p.stock > 0 && p.stock <= 10).length
)
const outOfStockCount = computed(() =>
  productsStore.products.filter(p => p.stock <= 0).length
)

const formatPrice = (price) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)

const resetForm = () => {
  form.value = { name: '', price: 0, image: '', category: '', description: '', stock: 10 }
  error.value = ''
  success.value = ''
  editingId.value = null
}

const openAddModal = () => {
  resetForm()
  isEditing.value = false
  showModal.value = true
}

const openEditModal = (product) => {
  resetForm()
  isEditing.value = true
  editingId.value = product._id || product.id
  form.value = {
    name: product.name || '',
    price: product.price || 0,
    image: product.image || '',
    category: product.category || '',
    description: product.description || '',
    stock: product.stock ?? 10
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  resetForm()
}

const saveProduct = async () => {
  error.value = ''
  success.value = ''
  const data = {
    name: form.value.name.trim(),
    price: Number(form.value.price),
    image: form.value.image.trim() || '/images/placeholder.jpg',
    category: form.value.category.trim(),
    description: form.value.description.trim() || '',
    stock: Number(form.value.stock) || 0
  }
  const result = isEditing.value
    ? await productsStore.updateProduct(editingId.value, data)
    : await productsStore.createProduct(data)

  if (result.success) {
    success.value = isEditing.value ? '✅ Cập nhật thành công!' : '✅ Thêm sản phẩm thành công!'
    setTimeout(() => closeModal(), 1000)
  } else {
    error.value = result.message || 'Có lỗi xảy ra'
  }
}

const deleteProduct = async (id) => {
  if (!id) return alert('Không tìm thấy ID sản phẩm')
  if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return
  const result = await productsStore.deleteProduct(id)
  if (!result.success) alert(result.message || 'Xóa thất bại')
}

const openStockModal = (product) => {
  stockEditProduct.value = product
  newStock.value = product.stock ?? 0
  stockError.value = ''
  showStockModal.value = true
}

const saveStock = async () => {
  if (newStock.value < 0) {
    stockError.value = 'Tồn kho không thể âm'
    return
  }
  stockLoading.value = true
  stockError.value = ''
  try {
    const id = stockEditProduct.value._id || stockEditProduct.value.id
    const result = await productsStore.updateProduct(id, {
      name: stockEditProduct.value.name,
      price: stockEditProduct.value.price,
      image: stockEditProduct.value.image,
      category: stockEditProduct.value.category,
      description: stockEditProduct.value.description || '',
      stock: Number(newStock.value)
    })
    if (result.success) {
      const idx = productsStore.products.findIndex(p => (p._id || p.id) === id)
      if (idx !== -1) productsStore.products[idx].stock = Number(newStock.value)
      showStockModal.value = false
    } else {
      stockError.value = result.message || 'Cập nhật thất bại'
    }
  } catch (err) {
    stockError.value = 'Lỗi kết nối, vui lòng thử lại'
  } finally {
    stockLoading.value = false
  }
}

onMounted(() => {
  productsStore.fetchAllProductsForAdmin()
})
</script>