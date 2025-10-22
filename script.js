// Sketch Gallery Application
class SketchGallery {
    constructor() {
        this.sketches = this.loadSketches();
        this.currentEditId = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderGallery();
        this.updateTagFilter();
    }

    // LocalStorage Management
    loadSketches() {
        const stored = localStorage.getItem('sketchGallery_posts');
        return stored ? JSON.parse(stored) : [];
    }

    saveSketches() {
        localStorage.setItem('sketchGallery_posts', JSON.stringify(this.sketches));
    }

    // Event Binding
    bindEvents() {
        // Modal controls
        document.getElementById('newSketchBtn').addEventListener('click', () => this.openUploadModal());
        document.getElementById('closeModal').addEventListener('click', () => this.closeModal());
        document.getElementById('closeDetailModal').addEventListener('click', () => this.closeDetailModal());
        document.getElementById('cancelBtn').addEventListener('click', () => this.closeModal());

        // Form submission
        document.getElementById('sketchForm').addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Image preview and management
        document.getElementById('sketchImage').addEventListener('change', (e) => this.handleImagePreview(e));
        document.getElementById('changeImageBtn').addEventListener('click', () => this.changeImage());
        document.getElementById('removeImageBtn').addEventListener('click', () => this.removeImage());

        // Real-time validation
        document.getElementById('sketchTitle').addEventListener('input', () => this.validateField('title'));
        document.getElementById('sketchDescription').addEventListener('input', () => this.validateField('description'));
        document.getElementById('sketchTags').addEventListener('input', () => this.validateField('tags'));

        // Filter and sort
        document.getElementById('tagFilter').addEventListener('change', () => this.renderGallery());
        document.getElementById('sortBy').addEventListener('change', () => this.renderGallery());

        // Modal backdrop clicks
        document.getElementById('uploadModal').addEventListener('click', (e) => {
            if (e.target.id === 'uploadModal') this.closeModal();
        });
        document.getElementById('detailModal').addEventListener('click', (e) => {
            if (e.target.id === 'detailModal') this.closeDetailModal();
        });

        // Detail modal actions
        document.getElementById('likeBtn').addEventListener('click', () => this.handleLike());
        document.getElementById('editBtn').addEventListener('click', () => this.handleEdit());
        document.getElementById('deleteBtn').addEventListener('click', () => this.handleDelete());

        // Comments
        document.getElementById('addCommentBtn').addEventListener('click', () => this.addComment());
        document.getElementById('commentInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addComment();
        });

        // Bottom navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => this.handleNavClick(e));
        });
    }

    // Generate unique ID
    generateId() {
        return 'sketch_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Image Preview
    handleImagePreview(event) {
        const file = event.target.files[0];
        const preview = document.getElementById('imagePreview');
        const actions = document.getElementById('imageActions');
        const imageError = document.getElementById('imageError');
        
        // Clear previous errors
        this.clearFieldError('image');
        
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                this.showFieldError('image', '이미지 파일만 업로드 가능합니다.');
                return;
            }
            
            // Validate file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                this.showFieldError('image', '파일 크기는 5MB 이하여야 합니다.');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (e) => {
                preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                preview.classList.add('has-image');
                actions.style.display = 'flex';
            };
            reader.readAsDataURL(file);
        } else {
            this.resetImagePreview();
        }
    }

    // Reset image preview
    resetImagePreview() {
        const preview = document.getElementById('imagePreview');
        const actions = document.getElementById('imageActions');
        const fileInput = document.getElementById('sketchImage');
        
        preview.innerHTML = '<div class="image-preview-placeholder">이미지를 선택하세요</div>';
        preview.classList.remove('has-image');
        actions.style.display = 'none';
        fileInput.value = '';
    }

    // Change image
    changeImage() {
        document.getElementById('sketchImage').click();
    }

    // Remove image
    removeImage() {
        this.resetImagePreview();
    }

    // Form Validation
    validateField(fieldName) {
        const field = document.getElementById(`sketch${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`);
        const value = field.value.trim();
        
        this.clearFieldError(fieldName);
        
        switch (fieldName) {
            case 'title':
                if (!value) {
                    this.showFieldError(fieldName, '제목을 입력해주세요.');
                    return false;
                }
                if (value.length < 2) {
                    this.showFieldError(fieldName, '제목은 2자 이상 입력해주세요.');
                    return false;
                }
                break;
            case 'description':
                if (!value) {
                    this.showFieldError(fieldName, '설명을 입력해주세요.');
                    return false;
                }
                if (value.length < 5) {
                    this.showFieldError(fieldName, '설명은 5자 이상 입력해주세요.');
                    return false;
                }
                break;
            case 'tags':
                if (!value) {
                    this.showFieldError(fieldName, '태그를 입력해주세요.');
                    return false;
                }
                const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
                if (tags.length === 0) {
                    this.showFieldError(fieldName, '유효한 태그를 입력해주세요.');
                    return false;
                }
                break;
        }
        return true;
    }

    // Show field error
    showFieldError(fieldName, message) {
        const field = document.getElementById(`sketch${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`);
        const errorElement = document.getElementById(`${fieldName}Error`);
        
        field.classList.add('error');
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }

    // Clear field error
    clearFieldError(fieldName) {
        const field = document.getElementById(`sketch${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`);
        const errorElement = document.getElementById(`${fieldName}Error`);
        
        field.classList.remove('error');
        errorElement.classList.remove('show');
    }

    // Validate all fields
    validateAllFields() {
        const fields = ['title', 'description', 'tags', 'image'];
        let isValid = true;
        
        fields.forEach(fieldName => {
            if (fieldName === 'image') {
                const imageFile = document.getElementById('sketchImage').files[0];
                if (!imageFile) {
                    this.showFieldError(fieldName, '이미지를 선택해주세요.');
                    isValid = false;
                }
            } else {
                if (!this.validateField(fieldName)) {
                    isValid = false;
                }
            }
        });
        
        return isValid;
    }

    // Form Submission
    handleFormSubmit(event) {
        event.preventDefault();
        
        // Validate all fields
        if (!this.validateAllFields()) {
            this.showNotification('모든 필수 항목을 올바르게 입력해주세요.', 'error');
            return;
        }
        
        const imageFile = document.getElementById('sketchImage').files[0];

        const reader = new FileReader();
        reader.onload = (e) => {
            const sketchData = {
                id: this.currentEditId || this.generateId(),
                title: document.getElementById('sketchTitle').value,
                description: document.getElementById('sketchDescription').value,
                tags: document.getElementById('sketchTags').value
                    .split(',')
                    .map(tag => tag.trim())
                    .filter(tag => tag.length > 0),
                image: e.target.result,
                createdAt: this.currentEditId ? 
                    this.sketches.find(s => s.id === this.currentEditId).createdAt : 
                    new Date().toISOString(),
                likes: this.currentEditId ? 
                    this.sketches.find(s => s.id === this.currentEditId).likes : 0,
                comments: this.currentEditId ? 
                    this.sketches.find(s => s.id === this.currentEditId).comments : []
            };

            if (this.currentEditId) {
                // Update existing sketch
                const index = this.sketches.findIndex(s => s.id === this.currentEditId);
                this.sketches[index] = sketchData;
                this.showNotification('스케치가 수정되었습니다.', 'success');
            } else {
                // Add new sketch
                this.sketches.unshift(sketchData);
                this.showNotification('새 스케치가 업로드되었습니다.', 'success');
            }

            this.saveSketches();
            this.renderGallery();
            this.updateTagFilter();
            this.closeModal();
            this.resetForm();
        };
        reader.readAsDataURL(imageFile);
    }

    // Reset Form
    resetForm() {
        document.getElementById('sketchForm').reset();
        this.resetImagePreview();
        document.getElementById('modalTitle').textContent = '새 스케치 업로드';
        this.currentEditId = null;
        
        // Clear all errors
        ['title', 'description', 'tags', 'image'].forEach(fieldName => {
            this.clearFieldError(fieldName);
        });
    }

    // Modal Controls
    openUploadModal() {
        document.getElementById('uploadModal').style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        document.getElementById('uploadModal').style.display = 'none';
        document.body.style.overflow = 'auto';
        this.resetForm();
    }

    closeDetailModal() {
        document.getElementById('detailModal').style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Gallery Rendering
    renderGallery() {
        const gallery = document.getElementById('gallery');
        const emptyState = document.getElementById('emptyState');
        
        let filteredSketches = this.getFilteredSketches();
        filteredSketches = this.getSortedSketches(filteredSketches);

        if (filteredSketches.length === 0) {
            gallery.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }

        gallery.style.display = 'grid';
        emptyState.style.display = 'none';

        gallery.innerHTML = filteredSketches.map(sketch => `
            <div class="sketch-card" onclick="sketchGallery.openDetailModal('${sketch.id}')">
                <img src="${sketch.image}" alt="${sketch.title}" class="sketch-image">
                <div class="sketch-info">
                    <h3 class="sketch-title">${sketch.title}</h3>
                    <div class="sketch-meta">
                        <span>${this.formatDate(sketch.createdAt)}</span>
                        <div class="sketch-likes">
                            <span>❤️</span>
                            <span>${sketch.likes}</span>
                        </div>
                    </div>
                    <div class="sketch-tags">
                        ${sketch.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Filtering and Sorting
    getFilteredSketches() {
        const tagFilter = document.getElementById('tagFilter').value;
        
        if (!tagFilter) {
            return this.sketches;
        }
        
        return this.sketches.filter(sketch => 
            sketch.tags.some(tag => tag.toLowerCase().includes(tagFilter.toLowerCase()))
        );
    }

    getSortedSketches(sketches) {
        const sortBy = document.getElementById('sortBy').value;
        
        switch (sortBy) {
            case 'latest':
                return sketches.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            case 'likes':
                return sketches.sort((a, b) => b.likes - a.likes);
            case 'alphabetical':
                return sketches.sort((a, b) => a.title.localeCompare(b.title));
            default:
                return sketches;
        }
    }

    updateTagFilter() {
        const tagFilter = document.getElementById('tagFilter');
        const allTags = [...new Set(this.sketches.flatMap(sketch => sketch.tags))];
        
        // Keep the current selection
        const currentValue = tagFilter.value;
        
        // Clear and rebuild options
        tagFilter.innerHTML = '<option value="">모든 태그</option>';
        allTags.forEach(tag => {
            const option = document.createElement('option');
            option.value = tag;
            option.textContent = tag;
            tagFilter.appendChild(option);
        });
        
        // Restore selection
        tagFilter.value = currentValue;
    }

    // Detail Modal
    openDetailModal(sketchId) {
        const sketch = this.sketches.find(s => s.id === sketchId);
        if (!sketch) return;

        document.getElementById('detailTitle').textContent = sketch.title;
        document.getElementById('detailImage').src = sketch.image;
        document.getElementById('detailImage').alt = sketch.title;
        document.getElementById('detailDescription').textContent = sketch.description;
        document.getElementById('detailDate').textContent = this.formatDate(sketch.createdAt);
        document.getElementById('detailLikes').textContent = `${sketch.likes}개 좋아요`;
        
        // Tags
        const tagsContainer = document.getElementById('detailTags');
        tagsContainer.innerHTML = sketch.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
        
        // Like button state
        const likeBtn = document.getElementById('likeBtn');
        likeBtn.onclick = () => this.handleLike(sketchId);
        
        // Edit button
        document.getElementById('editBtn').onclick = () => this.handleEdit(sketchId);
        
        // Delete button
        document.getElementById('deleteBtn').onclick = () => this.handleDelete(sketchId);
        
        // Comments
        this.renderComments(sketch.comments);
        
        document.getElementById('detailModal').style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // Like functionality
    handleLike(sketchId) {
        const sketch = this.sketches.find(s => s.id === sketchId);
        if (!sketch) return;

        sketch.likes++;
        this.saveSketches();
        this.renderGallery();
        
        // Update detail modal if open
        if (document.getElementById('detailModal').style.display === 'block') {
            document.getElementById('detailLikes').textContent = `${sketch.likes}개 좋아요`;
        }
        
        this.showNotification(`"${sketch.title}"을 좋아합니다!`, 'success');
    }

    // Edit functionality
    handleEdit(sketchId) {
        const sketch = this.sketches.find(s => s.id === sketchId);
        if (!sketch) return;

        this.currentEditId = sketchId;
        
        // Populate form
        document.getElementById('sketchTitle').value = sketch.title;
        document.getElementById('sketchDescription').value = sketch.description;
        document.getElementById('sketchTags').value = sketch.tags.join(', ');
        
        // Set image preview
        const preview = document.getElementById('imagePreview');
        const actions = document.getElementById('imageActions');
        preview.innerHTML = `<img src="${sketch.image}" alt="Preview">`;
        preview.classList.add('has-image');
        actions.style.display = 'flex';
        
        document.getElementById('modalTitle').textContent = '스케치 편집';
        
        this.closeDetailModal();
        this.openUploadModal();
    }

    // Delete functionality
    handleDelete(sketchId) {
        const sketch = this.sketches.find(s => s.id === sketchId);
        if (!sketch) return;

        if (confirm(`"${sketch.title}"을 삭제하시겠습니까?`)) {
            this.sketches = this.sketches.filter(s => s.id !== sketchId);
            this.saveSketches();
            this.renderGallery();
            this.updateTagFilter();
            this.closeDetailModal();
            this.showNotification('스케치가 삭제되었습니다.', 'success');
        }
    }

    // Comments functionality
    renderComments(comments) {
        const commentsList = document.getElementById('commentsList');
        commentsList.innerHTML = comments.map(comment => `
            <div class="comment">
                <div class="comment-user">${comment.user}</div>
                <div class="comment-text">${comment.text}</div>
                <div class="comment-date">${this.formatDate(comment.date)}</div>
            </div>
        `).join('');
    }

    addComment() {
        const commentInput = document.getElementById('commentInput');
        const commentText = commentInput.value.trim();
        
        if (!commentText) return;

        // Find the currently displayed sketch
        const detailTitle = document.getElementById('detailTitle').textContent;
        const sketch = this.sketches.find(s => s.title === detailTitle);
        
        if (sketch) {
            const newComment = {
                user: 'guest',
                text: commentText,
                date: new Date().toISOString()
            };
            
            sketch.comments.push(newComment);
            this.saveSketches();
            this.renderComments(sketch.comments);
            commentInput.value = '';
            this.showNotification('댓글이 추가되었습니다.', 'success');
        }
    }

    // Bottom Navigation Handler
    handleNavClick(event) {
        const clickedItem = event.currentTarget;
        const section = clickedItem.dataset.section;
        
        // Remove active class from all nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to clicked item
        clickedItem.classList.add('active');
        
        // Handle different sections
        switch (section) {
            case 'gallery':
                // Already on gallery, just scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
                break;
            case 'upload':
                this.openUploadModal();
                break;
            case 'favorites':
                this.showFavorites();
                break;
            case 'profile':
                this.showProfile();
                break;
        }
    }

    // Show favorites (most liked sketches)
    showFavorites() {
        const originalSort = document.getElementById('sortBy').value;
        document.getElementById('sortBy').value = 'likes';
        this.renderGallery();
        this.showNotification('좋아요가 많은 스케치를 보여드립니다.', 'success');
    }

    // Show profile (placeholder for future features)
    showProfile() {
        this.showNotification('프로필 기능은 곧 추가될 예정입니다!', 'warning');
    }

    // Utility functions
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Notification system
    showNotification(message, type = 'success') {
        const notifications = document.getElementById('notifications');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        notifications.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
}

// Global function for opening upload modal from empty state
function openUploadModal() {
    sketchGallery.openUploadModal();
}

// Initialize the application
let sketchGallery;
document.addEventListener('DOMContentLoaded', () => {
    sketchGallery = new SketchGallery();
});
