<template>
  <div class="admin-reseller-container">
    <!-- Toast Notification -->
    <transition name="toast">
      <div v-if="toast.show" class="toast-notification" :class="toast.type">
        {{ toast.message }}
      </div>
    </transition>

    <!-- Header -->
    <header class="page-header">
      <h1 class="page-title">{{ t.page_title }}</h1>
      <p class="page-subtitle">{{ t.page_subtitle }}</p>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>{{ t.loading }}</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <p class="error-message">{{ error }}</p>
      <button @click="loadData" class="btn btn-primary">{{ t.try_again }}</button>
    </div>

    <!-- Main Content -->
    <div v-else class="main-content">
      <!-- Tabs Navigation -->
      <div class="tabs-container">
        <!-- Desktop Tabs -->
        <nav class="tabs-nav desktop-tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="['tab-btn', { 'active': activeTab === tab.id }]"
          >
            <span class="tab-icon">{{ tab.icon }}</span>
            <span class="tab-label">{{ tab.label }}</span>
            <span v-if="tab.count !== null" class="tab-count">{{ tab.count }}</span>
          </button>
        </nav>

        <!-- Mobile Dropdown -->
        <div class="mobile-tabs">
          <button @click="mobileMenuOpen = !mobileMenuOpen" class="mobile-tab-trigger">
            <span class="tab-icon">{{ activeTabData.icon }}</span>
            <span class="tab-label">{{ activeTabData.label }}</span>
            <span class="dropdown-arrow">{{ mobileMenuOpen ? '▲' : '▼' }}</span>
          </button>
          <div v-if="mobileMenuOpen" class="mobile-tab-menu">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="selectMobileTab(tab.id)"
              :class="['mobile-tab-item', { 'active': activeTab === tab.id }]"
            >
              <span class="tab-icon">{{ tab.icon }}</span>
              <span class="tab-label">{{ tab.label }}</span>
              <span v-if="tab.count !== null" class="tab-count">{{ tab.count }}</span>
            </button>
          </div>
        </div>

        <!-- Search and Actions Bar -->
        <div class="toolbar">
          <div class="search-box">
            <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="M21 21l-4.35-4.35"></path>
            </svg>
            <input
              type="text"
              v-model="searchQuery"
              :placeholder="activeTab === 'companies' ? t.search_companies : t.search_resellers"
              class="search-input"
            />
          </div>
          <div class="toolbar-actions">
            <!-- Company filter (only on Resellers tab) -->
            <select v-if="activeTab === 'resellers'" v-model="companyFilter" class="filter-select">
              <option value="all">{{ t.filter_all_companies }}</option>
              <option v-for="company in resellerCompanies" :key="company.id" :value="company.id">
                {{ company.display_name || company.legal_name }}
              </option>
            </select>
            <!-- Country filter -->
            <select v-model="countryFilter" class="filter-select">
              <option value="all">{{ t.filter_all_countries }}</option>
              <option value="NO">{{ t.country_NO }}</option>
              <option value="SE">{{ t.country_SE }}</option>
              <option value="DK">{{ t.country_DK }}</option>
              <option value="FI">{{ t.country_FI }}</option>
            </select>
            <!-- Status filter -->
            <select v-model="statusFilter" class="filter-select">
              <option value="all">{{ t.filter_all }}</option>
              <option value="active">{{ t.filter_active }}</option>
              <option value="inactive">{{ t.filter_inactive }}</option>
            </select>
            <button
              @click="activeTab === 'companies' ? openCompanyModal() : openResellerModal()"
              class="btn btn-primary"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 5v14M5 12h14"></path>
              </svg>
              <span class="btn-text">{{ activeTab === 'companies' ? t.new_company : t.new_reseller }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Tab Content -->
      <div class="tab-content">
        <!-- TAB 1: Companies -->
        <div v-if="activeTab === 'companies'" class="tab-panel">
          <div v-if="filteredCompanies.length === 0" class="empty-state">
            <div class="empty-icon">🏢</div>
            <p>{{ t.no_companies }}</p>
          </div>

          <div v-else class="companies-list">
            <div
              v-for="company in paginatedCompanies"
              :key="company.id"
              :class="['company-card', { expanded: expandedCompanyId === company.id }]"
            >
              <!-- Company Header (always visible) -->
              <div class="company-header" @click="toggleCompany(company.id)">
                <div class="company-info">
                  <div class="company-name-row">
                    <span class="expand-icon">{{ expandedCompanyId === company.id ? '▼' : '▶' }}</span>
                    <h3 class="company-name">{{ company.display_name || company.legal_name }}</h3>
                    <span :class="['status-badge', company.status === 'active' ? 'status-active' : 'status-inactive']">
                      {{ company.status === 'active' ? t.active : t.inactive }}
                    </span>
                  </div>
                  <div class="company-meta">
                    <span v-if="company.organization_number" class="meta-item">
                      {{ t.org_number }}: {{ company.organization_number }}
                    </span>
                    <span class="meta-item">📍 {{ getCompanyLocationCount(company.id) }} {{ t.locations_count }}</span>
                    <span class="meta-item">👥 {{ getCompanyResellerCount(company.id) }} {{ t.resellers_count }}</span>
                  </div>
                </div>
                <button @click.stop="openCompanyModal(company)" class="btn-icon" :title="t.tooltip_edit_company">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
              </div>

              <!-- Company Details (expanded) -->
              <transition name="expand">
                <div v-if="expandedCompanyId === company.id" class="company-details">
                  <!-- Resellers Section -->
                  <div class="detail-section">
                    <div class="section-header">
                      <h4>{{ t.resellers_title }}</h4>
                      <button @click="openResellerModal(null, company.id)" class="btn btn-sm btn-secondary">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M12 5v14M5 12h14"></path>
                        </svg>
                        {{ t.add_location }}
                      </button>
                    </div>
                    <div v-if="getCompanyResellers(company.id).length === 0" class="empty-state-small">
                      <p>{{ t.no_resellers_in_company }}</p>
                    </div>
                    <div v-else class="resellers-list">
                      <div
                        v-for="reseller in getCompanyResellers(company.id)"
                        :key="reseller.id"
                        class="reseller-item"
                      >
                        <div class="reseller-info">
                          <div class="reseller-avatar">👤</div>
                          <div class="reseller-details">
                            <span class="reseller-name">{{ reseller.first_name }} {{ reseller.last_name }}</span>
                            <span class="reseller-email">{{ reseller.email }}</span>
                            <span v-if="reseller.phone" class="reseller-phone">{{ reseller.phone }}</span>
                          </div>
                        </div>
                        <div class="reseller-actions">
                          <span :class="['status-badge-sm', reseller.active ? 'status-active' : 'status-inactive']">
                            {{ reseller.active ? t.active : t.inactive }}
                          </span>
                          <div class="reseller-availability" v-if="getResellerAvailability(reseller.id)">
                            <span class="availability-badge">
                              ⚙️ {{ formatAvailabilitySummary(getResellerAvailability(reseller.id)) }}
                            </span>
                          </div>
                          <div class="reseller-availability" v-else>
                            <span class="availability-badge not-set">⚙️ {{ t.availability_not_set }}</span>
                          </div>
                          <button @click="openAvailabilityModal(reseller)" class="btn-icon btn-sm" :title="t.tooltip_edit_events">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <circle cx="12" cy="12" r="3"></circle>
                              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                            </svg>
                          </button>
                          <button @click="openResellerModal(reseller)" class="btn-icon btn-sm" :title="t.tooltip_edit_reseller">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Locations Section -->
                  <div class="detail-section">
                    <div class="section-header">
                      <h4>{{ t.locations_title }}</h4>
                      <button @click="openLocationModal(company)" class="btn btn-sm btn-secondary">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M12 5v14M5 12h14"></path>
                        </svg>
                        {{ t.add_location }}
                      </button>
                    </div>
                    <div v-if="getCompanyLocations(company.id).length === 0" class="empty-state-small">
                      <p>{{ t.no_locations }}</p>
                    </div>
                    <div v-else class="locations-grid">
                      <div
                        v-for="location in getCompanyLocations(company.id)"
                        :key="location.id"
                        class="location-tag"
                      >
                        <span class="location-icon">📍</span>
                        <span class="location-name">{{ location.location_name }}</span>
                        <button @click="removeCompanyLocation(company.id, location.id)" class="btn-remove" :title="t.remove">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 6L6 18M6 6l12 12"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </transition>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="totalCompanyPages > 1" class="pagination">
            <button
              @click="companiesPage--"
              :disabled="companiesPage === 1"
              class="btn btn-sm btn-secondary"
            >
              ←
            </button>
            <span class="page-info">{{ companiesPage }} / {{ totalCompanyPages }}</span>
            <button
              @click="companiesPage++"
              :disabled="companiesPage === totalCompanyPages"
              class="btn btn-sm btn-secondary"
            >
              →
            </button>
          </div>
        </div>

        <!-- TAB 2: Resellers (flat list) -->
        <div v-if="activeTab === 'resellers'" class="tab-panel">
          <div v-if="filteredResellers.length === 0" class="empty-state">
            <div class="empty-icon">👥</div>
            <p>{{ t.no_resellers }}</p>
          </div>

          <div v-else class="resellers-table-container">
            <!-- Desktop Table -->
            <table class="resellers-table desktop-only">
              <thead>
                <tr>
                  <th>{{ t.full_name }}</th>
                  <th>{{ t.email }}</th>
                  <th>{{ t.phone }}</th>
                  <th>{{ t.company }}</th>
                  <th>{{ t.availability_title }}</th>
                  <th>{{ t.status }}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="reseller in paginatedResellers" :key="reseller.id">
                  <td class="name-cell">
                    <span class="reseller-avatar-sm">👤</span>
                    {{ reseller.first_name }} {{ reseller.last_name }}
                  </td>
                  <td>{{ reseller.email }}</td>
                  <td>{{ reseller.phone || '-' }}</td>
                  <td>{{ getCompanyName(reseller.company_id) }}</td>
                  <td>
                    <span v-if="getResellerAvailability(reseller.id)" class="availability-badge">
                      {{ formatAvailabilitySummary(getResellerAvailability(reseller.id)) }}
                    </span>
                    <span v-else class="availability-badge not-set">{{ t.availability_not_set }}</span>
                  </td>
                  <td>
                    <span :class="['status-badge-sm', reseller.active ? 'status-active' : 'status-inactive']">
                      {{ reseller.active ? t.active : t.inactive }}
                    </span>
                  </td>
                  <td class="actions-cell">
                    <button @click="openAvailabilityModal(reseller)" class="btn-icon btn-sm" :title="t.tooltip_edit_events">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                      </svg>
                    </button>
                    <button @click="openResellerModal(reseller)" class="btn-icon btn-sm" :title="t.tooltip_edit_reseller">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Mobile Cards -->
            <div class="resellers-cards mobile-only">
              <div v-for="reseller in paginatedResellers" :key="reseller.id" class="reseller-card-mobile">
                <div class="card-header-mobile">
                  <div class="card-title-mobile">
                    <span class="reseller-avatar-sm">👤</span>
                    <div>
                      <span class="reseller-name">{{ reseller.first_name }} {{ reseller.last_name }}</span>
                      <span class="reseller-company">{{ getCompanyName(reseller.company_id) }}</span>
                    </div>
                  </div>
                  <span :class="['status-badge-sm', reseller.active ? 'status-active' : 'status-inactive']">
                    {{ reseller.active ? t.active : t.inactive }}
                  </span>
                </div>
                <div class="card-body-mobile">
                  <div class="card-row">
                    <span class="card-label">{{ t.email }}:</span>
                    <span>{{ reseller.email }}</span>
                  </div>
                  <div v-if="reseller.phone" class="card-row">
                    <span class="card-label">{{ t.phone }}:</span>
                    <span>{{ reseller.phone }}</span>
                  </div>
                  <div class="card-row">
                    <span class="card-label">{{ t.availability_title }}:</span>
                    <span v-if="getResellerAvailability(reseller.id)" class="availability-badge">
                      {{ formatAvailabilitySummary(getResellerAvailability(reseller.id)) }}
                    </span>
                    <span v-else class="availability-badge not-set">{{ t.availability_not_set }}</span>
                  </div>
                </div>
                <div class="card-actions-mobile">
                  <button @click="openAvailabilityModal(reseller)" class="btn btn-sm btn-secondary">
                    ⚙️ {{ t.availability_title }}
                  </button>
                  <button @click="openResellerModal(reseller)" class="btn btn-sm btn-secondary">
                    ✏️ {{ t.edit }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="totalResellerPages > 1" class="pagination">
            <button
              @click="resellersPage--"
              :disabled="resellersPage === 1"
              class="btn btn-sm btn-secondary"
            >
              ←
            </button>
            <span class="page-info">{{ resellersPage }} / {{ totalResellerPages }}</span>
            <button
              @click="resellersPage++"
              :disabled="resellersPage === totalResellerPages"
              class="btn btn-sm btn-secondary"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL: Company (Create/Edit) -->
    <div v-if="showCompanyModal" class="modal-overlay" @click.self="closeCompanyModal">
      <div class="modal">
        <div class="modal-header">
          <h2>{{ editingCompany ? t.edit_company : t.new_company }}</h2>
          <button @click="closeCompanyModal" class="btn-close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label>{{ t.company_display_name }} *</label>
              <input type="text" v-model="companyForm.display_name" class="form-input" />
            </div>
            <div class="form-group">
              <label>{{ t.company_legal_name }}</label>
              <input type="text" v-model="companyForm.legal_name" class="form-input" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>{{ t.org_number }}</label>
              <input type="text" v-model="companyForm.organization_number" class="form-input" />
            </div>
            <div class="form-group">
              <label>{{ t.country }}</label>
              <select v-model="companyForm.country_code" class="form-select">
                <option value="NO">{{ t.country_NO }}</option>
                <option value="SE">{{ t.country_SE }}</option>
                <option value="DK">{{ t.country_DK }}</option>
                <option value="FI">{{ t.country_FI }}</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>{{ t.email }}</label>
              <input type="email" v-model="companyForm.email" class="form-input" />
            </div>
            <div class="form-group">
              <label>{{ t.phone }}</label>
              <input type="tel" v-model="companyForm.phone" class="form-input" />
            </div>
          </div>
          <div class="form-group">
            <label>{{ t.address_line_1 }}</label>
            <input type="text" v-model="companyForm.address_line_1" class="form-input" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>{{ t.postal_code }}</label>
              <input type="text" v-model="companyForm.postal_code" class="form-input" />
            </div>
            <div class="form-group flex-2">
              <label>{{ t.city }}</label>
              <input type="text" v-model="companyForm.city" class="form-input" />
            </div>
          </div>
          <div class="form-group">
            <label>{{ t.website }}</label>
            <input type="url" v-model="companyForm.website" class="form-input" placeholder="https://" />
          </div>
          <div class="form-row checkboxes">
            <label class="checkbox-label">
              <input type="checkbox" v-model="companyForm.is_reseller" />
              {{ t.is_reseller }}
            </label>
            <label class="checkbox-label">
              <input type="checkbox" v-model="companyForm.is_customer" />
              {{ t.is_customer }}
            </label>
          </div>
          <div class="form-group">
            <label>{{ t.status }}</label>
            <select v-model="companyForm.status" class="form-select">
              <option value="active">{{ t.active }}</option>
              <option value="inactive">{{ t.inactive }}</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeCompanyModal" class="btn btn-secondary">{{ t.cancel }}</button>
          <button @click="saveCompany" :disabled="savingCompany" class="btn btn-primary">
            {{ savingCompany ? t.saving : t.save }}
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL: Reseller (Create/Edit) -->
    <div v-if="showResellerModal" class="modal-overlay" @click.self="closeResellerModal">
      <div class="modal">
        <div class="modal-header">
          <h2>{{ editingReseller ? t.edit_reseller : t.new_reseller }}</h2>
          <button @click="closeResellerModal" class="btn-close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label>{{ t.first_name }} *</label>
              <input type="text" v-model="resellerForm.first_name" class="form-input" />
            </div>
            <div class="form-group">
              <label>{{ t.last_name }} *</label>
              <input type="text" v-model="resellerForm.last_name" class="form-input" />
            </div>
          </div>
          <div class="form-group">
            <label>{{ t.email }} *</label>
            <input type="email" v-model="resellerForm.email" class="form-input" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>{{ t.phone }}</label>
              <input type="tel" v-model="resellerForm.phone" class="form-input" />
            </div>
            <div class="form-group">
              <label>{{ t.country }}</label>
              <select v-model="resellerForm.country_code" class="form-select">
                <option value="NO">{{ t.country_NO }}</option>
                <option value="SE">{{ t.country_SE }}</option>
                <option value="DK">{{ t.country_DK }}</option>
                <option value="FI">{{ t.country_FI }}</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>{{ t.company }} *</label>
            <select v-model="resellerForm.company_id" class="form-select">
              <option value="">{{ t.select_company }}</option>
              <option v-for="company in resellerCompanies" :key="company.id" :value="company.id">
                {{ company.display_name || company.legal_name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="resellerForm.active" />
              {{ t.active }}
            </label>
          </div>
          <div class="form-group">
            <label>{{ t.comment }}</label>
            <textarea v-model="resellerForm.comment" class="form-textarea" :placeholder="t.comment_placeholder" rows="3"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeResellerModal" class="btn btn-secondary">{{ t.cancel }}</button>
          <button @click="saveReseller" :disabled="savingReseller" class="btn btn-primary">
            {{ savingReseller ? t.saving : t.save }}
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL: Add Locations to Company -->
    <div v-if="showLocationModal" class="modal-overlay" @click.self="closeLocationModal">
      <div class="modal modal-sm">
        <div class="modal-header">
          <h2>{{ t.select_locations }}</h2>
          <button @click="closeLocationModal" class="btn-close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <p class="modal-subtitle">{{ editingLocationCompany?.display_name }}</p>
          <div class="search-box modal-search">
            <input
              type="text"
              v-model="locationSearchQuery"
              :placeholder="t.search_placeholder"
              class="form-input"
            />
          </div>
          <div class="locations-checklist">
            <label
              v-for="location in availableLocationsFiltered"
              :key="location.id"
              :class="['checkbox-item', { selected: selectedLocationIds.includes(location.id) }]"
            >
              <input
                type="checkbox"
                :value="location.id"
                v-model="selectedLocationIds"
              />
              <span class="location-name">{{ location.location_name }}</span>
            </label>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeLocationModal" class="btn btn-secondary">{{ t.cancel }}</button>
          <button @click="saveCompanyLocations" :disabled="savingLocations" class="btn btn-primary">
            {{ savingLocations ? t.saving : t.add }} ({{ selectedLocationIds.length }})
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL: Availability & Exceptions -->
    <div v-if="showAvailabilityModal" class="modal-overlay" @click.self="closeAvailabilityModal">
      <div class="modal modal-lg">
        <div class="modal-header">
          <div>
            <h2>{{ t.availability_title }}</h2>
            <p class="modal-subtitle">{{ editingAvailabilityReseller?.first_name }} {{ editingAvailabilityReseller?.last_name }} • {{ getCompanyName(editingAvailabilityReseller?.company_id) }}</p>
          </div>
          <button @click="closeAvailabilityModal" class="btn-close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <!-- General Availability -->
          <div class="availability-section">
            <h3>{{ t.availability_title }}</h3>

            <div class="form-group">
              <label>{{ t.days }}</label>
              <div class="days-grid">
                <label v-for="day in allDays" :key="day.value" class="day-checkbox">
                  <input type="checkbox" :value="day.value" v-model="availabilityForm.days" />
                  <span class="day-label">{{ day.short }}</span>
                </label>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>{{ t.from_time }}</label>
                <select v-model="availabilityForm.startHour" class="form-select">
                  <option v-for="hour in hoursOptions" :key="hour" :value="hour">{{ hour }}</option>
                </select>
              </div>
              <div class="form-group">
                <label>{{ t.to_time }}</label>
                <select v-model="availabilityForm.endHour" class="form-select">
                  <option v-for="hour in hoursOptions" :key="hour" :value="hour">{{ hour }}</option>
                </select>
              </div>
              <div class="form-group">
                <label>{{ t.capacity }}</label>
                <select v-model="availabilityForm.capacity" class="form-select">
                  <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
                </select>
                <span class="form-hint">{{ t.capacity_per_hour }}</span>
              </div>
            </div>

            <div class="form-group">
              <label>{{ t.default_address }}</label>
              <input type="text" v-model="availabilityForm.defaultAddress" class="form-input" />
            </div>

            <div class="form-group">
              <label>{{ t.maps_url }} ({{ t.optional }})</label>
              <input type="url" v-model="availabilityForm.mapsUrl" class="form-input" placeholder="https://maps.google.com/..." />
            </div>

            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="availabilityForm.active" />
                {{ t.availability_active }}
              </label>
            </div>
          </div>

          <!-- Exceptions -->
          <div class="exceptions-section">
            <div class="section-header">
              <h3>{{ t.exceptions_title }}</h3>
              <button @click="showExceptionForm = true" class="btn btn-sm btn-secondary">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 5v14M5 12h14"></path>
                </svg>
                {{ t.add_exception }}
              </button>
            </div>

            <!-- Exception Form (inline) -->
            <div v-if="showExceptionForm" class="exception-form">
              <div class="form-row">
                <div class="form-group">
                  <label>{{ t.exception_type }}</label>
                  <select v-model="exceptionForm.isUnavailable" class="form-select">
                    <option :value="true">{{ t.exception_unavailable }}</option>
                    <option :value="false">{{ t.exception_capacity }}</option>
                  </select>
                </div>
                <div v-if="!exceptionForm.isUnavailable" class="form-group">
                  <label>{{ t.capacity }}</label>
                  <select v-model="exceptionForm.capacityOverride" class="form-select">
                    <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
                  </select>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>{{ t.exception_from_date }}</label>
                  <input type="date" v-model="exceptionForm.startDate" class="form-input" />
                </div>
                <div class="form-group">
                  <label>{{ t.exception_to_date }}</label>
                  <input type="date" v-model="exceptionForm.endDate" class="form-input" />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>{{ t.exception_from_time }} ({{ t.optional }})</label>
                  <select v-model="exceptionForm.startTime" class="form-select">
                    <option value="">{{ t.exception_full_day }}</option>
                    <option v-for="hour in hoursOptions" :key="hour" :value="hour">{{ hour }}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>{{ t.exception_to_time }}</label>
                  <select v-model="exceptionForm.endTime" class="form-select" :disabled="!exceptionForm.startTime">
                    <option value="">-</option>
                    <option v-for="hour in hoursOptions" :key="hour" :value="hour">{{ hour }}</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label>{{ t.exception_description }} ({{ t.optional }})</label>
                <input type="text" v-model="exceptionForm.description" class="form-input" :placeholder="t.exception_description_placeholder" />
              </div>
              <div class="exception-form-actions">
                <button @click="showExceptionForm = false" class="btn btn-secondary btn-sm">{{ t.cancel }}</button>
                <button @click="addException" :disabled="savingException" class="btn btn-primary btn-sm">
                  {{ savingException ? t.saving : t.add }}
                </button>
              </div>
            </div>

            <!-- Exceptions List -->
            <div v-if="currentExceptions.length === 0 && !showExceptionForm" class="empty-state-small">
              <p>{{ t.no_exceptions }}</p>
            </div>
            <div v-else class="exceptions-list">
              <div v-for="exception in currentExceptions" :key="exception.id" class="exception-item">
                <div class="exception-info">
                  <span class="exception-icon">📅</span>
                  <div class="exception-details">
                    <span class="exception-dates">{{ formatExceptionDates(exception) }}</span>
                    <span class="exception-description" v-if="exception.description">{{ exception.description }}</span>
                  </div>
                </div>
                <div class="exception-meta">
                  <span :class="['exception-type-badge', exception.is_unavailable ? 'unavailable' : 'capacity']">
                    {{ exception.is_unavailable ? t.exception_unavailable : `${t.capacity}: ${exception.capacity_override}` }}
                  </span>
                  <button @click="deleteException(exception.id)" class="btn-icon btn-danger-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeAvailabilityModal" class="btn btn-secondary">{{ t.cancel }}</button>
          <button @click="saveAvailability" :disabled="savingAvailability" class="btn btn-primary">
            {{ savingAvailability ? t.saving : t.save }}
          </button>
        </div>
      </div>
    </div>

    <!-- Confirm Dialog -->
    <div v-if="showConfirmDialog" class="modal-overlay" @click.self="cancelConfirm">
      <div class="modal modal-confirm">
        <div class="confirm-icon">⚠️</div>
        <h3>{{ t.confirm_delete }}</h3>
        <p>{{ confirmDialogMessage }}</p>
        <div class="modal-footer modal-footer-centered">
          <button @click="cancelConfirm" class="btn btn-secondary">{{ t.cancel }}</button>
          <button @click="executeConfirm" class="btn btn-danger">{{ t.delete }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createClient } from '@supabase/supabase-js'
import { i18n } from './i18n.js'

export default {
  name: 'AdminResellerManagement',

  props: {
    content: { type: Object, required: true }
  },

  data() {
    return {
      // Core state
      loading: true,
      error: null,
      supabase: null,
      isMobile: false,
      currentUser: null,
      isAdmin: false,

      // Toast
      toast: {
        show: false,
        message: '',
        type: 'success'
      },

      // Tabs & Navigation
      activeTab: 'companies',
      mobileMenuOpen: false,
      expandedCompanyId: null,

      // Search & Filters
      searchQuery: '',
      statusFilter: 'all',
      countryFilter: 'all',
      companyFilter: 'all',
      locationSearchQuery: '',

      // Pagination
      companiesPage: 1,
      resellersPage: 1,

      // Data
      companies: [],
      resellers: [],
      locations: [],
      companyLocations: [], // locations_companies junction
      availabilities: [],
      exceptions: [],

      // Modals
      showCompanyModal: false,
      showResellerModal: false,
      showLocationModal: false,
      showAvailabilityModal: false,
      showExceptionForm: false,
      showConfirmDialog: false,

      // Editing state
      editingCompany: null,
      editingReseller: null,
      editingLocationCompany: null,
      editingAvailabilityReseller: null,

      // Form data
      companyForm: this.getEmptyCompanyForm(),
      resellerForm: this.getEmptyResellerForm(),
      selectedLocationIds: [],
      availabilityForm: this.getEmptyAvailabilityForm(),
      exceptionForm: this.getEmptyExceptionForm(),
      currentExceptions: [],

      // Saving states
      savingCompany: false,
      savingReseller: false,
      savingLocations: false,
      savingAvailability: false,
      savingException: false,

      // Confirm dialog
      confirmDialogMessage: '',
      confirmDialogCallback: null,

      // Constants
      allDays: [
        { value: 'Monday', short: 'Ma', label: 'monday' },
        { value: 'Tuesday', short: 'Ti', label: 'tuesday' },
        { value: 'Wednesday', short: 'On', label: 'wednesday' },
        { value: 'Thursday', short: 'To', label: 'thursday' },
        { value: 'Friday', short: 'Fr', label: 'friday' },
        { value: 'Saturday', short: 'Lø', label: 'saturday' },
        { value: 'Sunday', short: 'Sø', label: 'sunday' }
      ],
      hoursOptions: [
        '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
        '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00',
        '20:00', '21:00', '22:00'
      ]
    }
  },

  computed: {
    pageSize() {
      return this.content?.pageSize || 25
    },
    language() {
      return this.content?.language || 'no'
    },
    defaultCountry() {
      return this.content?.defaultCountry || 'NO'
    },
    t() {
      return i18n[this.language] || i18n['no']
    },

    tabs() {
      return [
        { id: 'companies', label: this.t.tab_companies, icon: '🏢', count: this.filteredCompanies.length },
        { id: 'resellers', label: this.t.tab_resellers, icon: '👥', count: this.filteredResellers.length }
      ]
    },

    activeTabData() {
      return this.tabs.find(t => t.id === this.activeTab) || this.tabs[0]
    },

    // Companies that are resellers
    resellerCompanies() {
      return this.companies.filter(c => c.is_reseller)
    },

    filteredCompanies() {
      let result = this.resellerCompanies

      // Search filter
      if (this.searchQuery) {
        const search = this.searchQuery.toLowerCase()
        result = result.filter(c =>
          (c.display_name || '').toLowerCase().includes(search) ||
          (c.legal_name || '').toLowerCase().includes(search) ||
          (c.organization_number || '').toLowerCase().includes(search) ||
          (c.email || '').toLowerCase().includes(search)
        )
      }

      // Country filter
      if (this.countryFilter !== 'all') {
        result = result.filter(c => c.country_code === this.countryFilter)
      }

      // Status filter
      if (this.statusFilter !== 'all') {
        const isActive = this.statusFilter === 'active'
        result = result.filter(c => (c.status === 'active') === isActive)
      }

      return result.sort((a, b) => (a.display_name || a.legal_name || '').localeCompare(b.display_name || b.legal_name || ''))
    },

    paginatedCompanies() {
      const start = (this.companiesPage - 1) * this.pageSize
      return this.filteredCompanies.slice(start, start + this.pageSize)
    },

    totalCompanyPages() {
      return Math.ceil(this.filteredCompanies.length / this.pageSize)
    },

    filteredResellers() {
      let result = this.resellers

      // Search filter
      if (this.searchQuery) {
        const search = this.searchQuery.toLowerCase()
        result = result.filter(r =>
          (r.first_name || '').toLowerCase().includes(search) ||
          (r.last_name || '').toLowerCase().includes(search) ||
          (r.email || '').toLowerCase().includes(search) ||
          (r.phone || '').toLowerCase().includes(search) ||
          this.getCompanyName(r.company_id).toLowerCase().includes(search)
        )
      }

      // Company filter
      if (this.companyFilter !== 'all') {
        result = result.filter(r => r.company_id === this.companyFilter)
      }

      // Country filter
      if (this.countryFilter !== 'all') {
        result = result.filter(r => r.country_code === this.countryFilter)
      }

      // Status filter
      if (this.statusFilter !== 'all') {
        const isActive = this.statusFilter === 'active'
        result = result.filter(r => r.active === isActive)
      }

      return result.sort((a, b) => `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`))
    },

    paginatedResellers() {
      const start = (this.resellersPage - 1) * this.pageSize
      return this.filteredResellers.slice(start, start + this.pageSize)
    },

    totalResellerPages() {
      return Math.ceil(this.filteredResellers.length / this.pageSize)
    },

    availableLocationsFiltered() {
      if (!this.editingLocationCompany) return []

      const companyLocationIds = this.companyLocations
        .filter(cl => cl.company_id === this.editingLocationCompany.id)
        .map(cl => cl.location_id)

      let available = this.locations.filter(l => !companyLocationIds.includes(l.id))

      if (this.locationSearchQuery) {
        const search = this.locationSearchQuery.toLowerCase()
        available = available.filter(l => l.location_name.toLowerCase().includes(search))
      }

      return available.sort((a, b) => a.location_name.localeCompare(b.location_name))
    }
  },

  async mounted() {
    this.handleResize()
    window.addEventListener('resize', this.handleResize)
    this.initSupabase()

    // Check admin access before loading data
    const hasAccess = await this.checkAdminAccess()
    if (!hasAccess) {
      this.error = this.t.error_not_admin
      this.loading = false
      return
    }

    await this.loadData()
  },

  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)
  },

  methods: {
    // ===== HELPERS =====
    handleResize() {
      this.isMobile = window.innerWidth < 768
    },

    showToast(message, type = 'success') {
      this.toast.message = message
      this.toast.type = type
      this.toast.show = true
      setTimeout(() => { this.toast.show = false }, 3000)
    },

    showConfirm(message, callback) {
      this.confirmDialogMessage = message
      this.confirmDialogCallback = callback
      this.showConfirmDialog = true
    },

    cancelConfirm() {
      this.showConfirmDialog = false
      this.confirmDialogCallback = null
    },

    executeConfirm() {
      if (this.confirmDialogCallback) this.confirmDialogCallback()
      this.showConfirmDialog = false
      this.confirmDialogCallback = null
    },

    selectMobileTab(tabId) {
      this.activeTab = tabId
      this.mobileMenuOpen = false
      this.searchQuery = ''
    },

    toggleCompany(companyId) {
      this.expandedCompanyId = this.expandedCompanyId === companyId ? null : companyId
    },

    // ===== DATA LOADING (singleton pattern) =====
    initSupabase() {
      const supabaseUrl = this.content?.supabaseUrl || 'https://prjefvmijalarmbxytjj.supabase.co'
      const supabaseKey = this.content?.supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByamVmdm1pamFsYXJtYnh5dGpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzODY1MjQsImV4cCI6MjA3Njk2MjUyNH0.4Czz_OjQIvmMDrz_lckxUcX3MUEu8O_WiDnP0q_6VWQ'

      // 1. Prøv WeWeb Supabase plugin først (delt instans)
      if (typeof wwLib !== 'undefined' && wwLib.wwPlugins?.supabase?.instance) {
        this.supabase = wwLib.wwPlugins.supabase.instance
        console.log('swipp_admin_reseller: Using WeWeb Supabase plugin')
        return
      }

      // 2. Prøv global singleton (unngår "Multiple GoTrueClient instances")
      const globalKey = `_supabase_${supabaseUrl}`
      if (window[globalKey]) {
        this.supabase = window[globalKey]
        console.log('swipp_admin_reseller: Reusing existing Supabase client')
        return
      }

      // 3. Opprett ny klient og lagre globalt
      this.supabase = createClient(supabaseUrl, supabaseKey)
      window[globalKey] = this.supabase
      console.log('swipp_admin_reseller: Created new Supabase client (singleton)')
    },

    async checkAdminAccess() {
      try {
        // Get current session
        const { data: { session }, error: sessionError } = await this.supabase.auth.getSession()

        if (sessionError || !session) {
          console.warn('No active session - redirecting to login')
          // Redirect to login if configured
          const redirectUrl = this.content?.loginRedirectUrl
          if (redirectUrl && typeof window !== 'undefined') {
            window.location.href = redirectUrl
          }
          return false
        }

        // Check if user is admin by querying admin_users table
        const { data: adminUser, error: adminError } = await this.supabase
          .from('admin_users')
          .select('id, active')
          .eq('auth_id', session.user.id)
          .single()

        if (adminError || !adminUser || !adminUser.active) {
          console.warn('User is not an active admin')
          return false
        }

        this.currentUser = session.user
        this.isAdmin = true
        return true
      } catch (err) {
        console.error('Error checking admin access:', err)
        return false
      }
    },

    async loadData() {
      this.loading = true
      this.error = null

      try {
        // Load companies
        const { data: companies, error: companiesError } = await this.supabase
          .from('companies')
          .select('*')
          .order('display_name')

        if (companiesError) throw companiesError
        this.companies = companies || []

        // Load resellers
        const { data: resellers, error: resellersError } = await this.supabase
          .from('resellers')
          .select('*')
          .order('first_name')

        if (resellersError) throw resellersError
        this.resellers = resellers || []

        // Load locations
        const { data: locations, error: locationsError } = await this.supabase
          .from('locations')
          .select('*')
          .order('location_name')

        if (locationsError) throw locationsError
        this.locations = locations || []

        // Load company-location junction
        const { data: companyLocations, error: clError } = await this.supabase
          .from('locations_companies')
          .select('*')

        if (clError) throw clError
        this.companyLocations = companyLocations || []

        // Load availabilities
        const { data: availabilities, error: availError } = await this.supabase
          .from('booking_availability')
          .select('*')

        if (availError) throw availError
        this.availabilities = availabilities || []

        // Load exceptions
        const { data: exceptions, error: excError } = await this.supabase
          .from('booking_availability_exceptions')
          .select('*')
          .gte('end_datetime', new Date().toISOString())
          .order('start_datetime')

        if (excError) throw excError
        this.exceptions = exceptions || []

      } catch (err) {
        console.error('Error loading data:', err)
        this.error = this.t.error_loading
      } finally {
        this.loading = false
      }
    },

    // ===== DATA GETTERS =====
    getCompanyName(companyId) {
      const company = this.companies.find(c => c.id === companyId)
      return company?.display_name || company?.legal_name || '-'
    },

    getCompanyResellers(companyId) {
      return this.resellers.filter(r => r.company_id === companyId)
    },

    getCompanyResellerCount(companyId) {
      return this.getCompanyResellers(companyId).length
    },

    getCompanyLocations(companyId) {
      const locationIds = this.companyLocations
        .filter(cl => cl.company_id === companyId)
        .map(cl => cl.location_id)
      return this.locations.filter(l => locationIds.includes(l.id))
    },

    getCompanyLocationCount(companyId) {
      return this.companyLocations.filter(cl => cl.company_id === companyId).length
    },

    getResellerAvailability(resellerId) {
      return this.availabilities.find(a => a.reseller_id === resellerId)
    },

    getResellerExceptions(resellerId) {
      const availability = this.getResellerAvailability(resellerId)
      if (!availability) return []
      return this.exceptions.filter(e => e.booking_availability_id === availability.id)
    },

    // ===== FORMATTERS =====
    formatAvailabilitySummary(availability) {
      if (!availability) return ''
      const days = availability.days_input || []
      const hours = availability.hours_input || []

      // Format days
      const dayMap = { 'Monday': 'Ma', 'Tuesday': 'Ti', 'Wednesday': 'On', 'Thursday': 'To', 'Friday': 'Fr', 'Saturday': 'Lø', 'Sunday': 'Sø' }
      const dayStr = days.map(d => dayMap[d] || d.substring(0, 2)).join('-')

      // Format hours
      let hourStr = ''
      if (hours.length > 0) {
        const first = hours[0].split('-')[0]
        const last = hours[hours.length - 1].split('-')[1]
        hourStr = `${first}-${last}`
      }

      return `${dayStr} ${hourStr}, ${availability.default_capacity_per_hour}/t`
    },

    formatExceptionDates(exception) {
      const start = new Date(exception.start_datetime)
      const end = new Date(exception.end_datetime)

      const dateOpts = { day: 'numeric', month: 'short', year: 'numeric' }
      const timeOpts = { hour: '2-digit', minute: '2-digit' }

      const startDate = start.toLocaleDateString(this.language === 'en' ? 'en-GB' : 'nb-NO', dateOpts)
      const endDate = end.toLocaleDateString(this.language === 'en' ? 'en-GB' : 'nb-NO', dateOpts)

      // Check if same day
      if (startDate === endDate) {
        const startTime = start.toLocaleTimeString(this.language === 'en' ? 'en-GB' : 'nb-NO', timeOpts)
        const endTime = end.toLocaleTimeString(this.language === 'en' ? 'en-GB' : 'nb-NO', timeOpts)
        return `${startDate}, ${startTime} - ${endTime}`
      }

      return `${startDate} - ${endDate}`
    },

    // ===== FORM HELPERS =====
    getEmptyCompanyForm() {
      return {
        display_name: '',
        legal_name: '',
        organization_number: '',
        email: '',
        phone: '',
        website: '',
        address_line_1: '',
        postal_code: '',
        city: '',
        country_code: this.defaultCountry || 'NO',
        is_reseller: true,
        is_customer: false,
        status: 'active'
      }
    },

    getEmptyResellerForm() {
      return {
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        country_code: this.defaultCountry || 'NO',
        company_id: '',
        active: true,
        comment: ''
      }
    },

    getEmptyAvailabilityForm() {
      return {
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        startHour: '09:00',
        endHour: '17:00',
        capacity: 2,
        defaultAddress: '',
        mapsUrl: '',
        active: true
      }
    },

    getEmptyExceptionForm() {
      return {
        isUnavailable: true,
        capacityOverride: 1,
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        description: ''
      }
    },

    // ===== COMPANY MODAL =====
    openCompanyModal(company = null) {
      this.editingCompany = company
      if (company) {
        this.companyForm = { ...company }
      } else {
        this.companyForm = this.getEmptyCompanyForm()
      }
      this.showCompanyModal = true
    },

    closeCompanyModal() {
      this.showCompanyModal = false
      this.editingCompany = null
      this.companyForm = this.getEmptyCompanyForm()
    },

    async saveCompany() {
      if (!this.companyForm.display_name && !this.companyForm.legal_name) {
        this.showToast(this.t.error_required_fields, 'error')
        return
      }

      this.savingCompany = true
      try {
        const data = {
          display_name: this.companyForm.display_name,
          legal_name: this.companyForm.legal_name,
          organization_number: this.companyForm.organization_number,
          email: this.companyForm.email,
          phone: this.companyForm.phone,
          website: this.companyForm.website,
          address_line_1: this.companyForm.address_line_1,
          postal_code: this.companyForm.postal_code,
          city: this.companyForm.city,
          country_code: this.companyForm.country_code,
          is_reseller: this.companyForm.is_reseller,
          is_customer: this.companyForm.is_customer,
          status: this.companyForm.status
        }

        if (this.editingCompany) {
          const { error } = await this.supabase
            .from('companies')
            .update(data)
            .eq('id', this.editingCompany.id)

          if (error) throw error
          this.showToast(this.t.company_updated)
        } else {
          const { error } = await this.supabase
            .from('companies')
            .insert([data])

          if (error) throw error
          this.showToast(this.t.company_created)
        }

        await this.loadData()
        this.closeCompanyModal()
      } catch (err) {
        console.error('Error saving company:', err)
        this.showToast(this.t.error_saving, 'error')
      } finally {
        this.savingCompany = false
      }
    },

    // ===== RESELLER MODAL =====
    openResellerModal(reseller = null, preselectedCompanyId = null) {
      this.editingReseller = reseller
      if (reseller) {
        this.resellerForm = { ...reseller }
      } else {
        this.resellerForm = this.getEmptyResellerForm()
        if (preselectedCompanyId) {
          this.resellerForm.company_id = preselectedCompanyId
        }
      }
      this.showResellerModal = true
    },

    closeResellerModal() {
      this.showResellerModal = false
      this.editingReseller = null
      this.resellerForm = this.getEmptyResellerForm()
    },

    async saveReseller() {
      if (!this.resellerForm.first_name || !this.resellerForm.last_name || !this.resellerForm.email || !this.resellerForm.company_id) {
        this.showToast(this.t.error_required_fields, 'error')
        return
      }

      this.savingReseller = true
      try {
        const data = {
          first_name: this.resellerForm.first_name,
          last_name: this.resellerForm.last_name,
          email: this.resellerForm.email,
          phone: this.resellerForm.phone,
          country_code: this.resellerForm.country_code,
          company_id: this.resellerForm.company_id,
          active: this.resellerForm.active,
          comment: this.resellerForm.comment
        }

        if (this.editingReseller) {
          const { error } = await this.supabase
            .from('resellers')
            .update(data)
            .eq('id', this.editingReseller.id)

          if (error) throw error
          this.showToast(this.t.reseller_updated)
        } else {
          const { error } = await this.supabase
            .from('resellers')
            .insert([data])

          if (error) throw error
          this.showToast(this.t.reseller_created)
        }

        await this.loadData()
        this.closeResellerModal()
      } catch (err) {
        console.error('Error saving reseller:', err)
        this.showToast(this.t.error_saving, 'error')
      } finally {
        this.savingReseller = false
      }
    },

    // ===== LOCATION MODAL =====
    openLocationModal(company) {
      this.editingLocationCompany = company
      this.selectedLocationIds = []
      this.locationSearchQuery = ''
      this.showLocationModal = true
    },

    closeLocationModal() {
      this.showLocationModal = false
      this.editingLocationCompany = null
      this.selectedLocationIds = []
    },

    async saveCompanyLocations() {
      if (this.selectedLocationIds.length === 0) return

      this.savingLocations = true
      try {
        const inserts = this.selectedLocationIds.map(locationId => ({
          company_id: this.editingLocationCompany.id,
          location_id: locationId
        }))

        const { error } = await this.supabase
          .from('locations_companies')
          .insert(inserts)

        if (error) throw error

        this.showToast(this.t.location_added)
        await this.loadData()
        this.closeLocationModal()
      } catch (err) {
        console.error('Error adding locations:', err)
        this.showToast(this.t.error_saving, 'error')
      } finally {
        this.savingLocations = false
      }
    },

    async removeCompanyLocation(companyId, locationId) {
      try {
        const { error } = await this.supabase
          .from('locations_companies')
          .delete()
          .eq('company_id', companyId)
          .eq('location_id', locationId)

        if (error) throw error

        this.showToast(this.t.location_removed)
        await this.loadData()
      } catch (err) {
        console.error('Error removing location:', err)
        this.showToast(this.t.error_deleting, 'error')
      }
    },

    // ===== AVAILABILITY MODAL =====
    openAvailabilityModal(reseller) {
      this.editingAvailabilityReseller = reseller
      const availability = this.getResellerAvailability(reseller.id)

      if (availability) {
        // Parse existing availability
        const hours = availability.hours_input || []
        const startHour = hours.length > 0 ? hours[0].split('-')[0] : '09:00'
        const endHour = hours.length > 0 ? hours[hours.length - 1].split('-')[1] : '17:00'

        this.availabilityForm = {
          days: availability.days_input || [],
          startHour,
          endHour,
          capacity: availability.default_capacity_per_hour || 2,
          defaultAddress: availability.default_address || '',
          mapsUrl: availability.default_address_maps_url || '',
          active: availability.active !== false
        }
        this.currentExceptions = this.getResellerExceptions(reseller.id)
      } else {
        this.availabilityForm = this.getEmptyAvailabilityForm()
        this.currentExceptions = []
      }

      this.exceptionForm = this.getEmptyExceptionForm()
      this.showExceptionForm = false
      this.showAvailabilityModal = true
    },

    closeAvailabilityModal() {
      this.showAvailabilityModal = false
      this.editingAvailabilityReseller = null
      this.currentExceptions = []
      this.showExceptionForm = false
    },

    async saveAvailability() {
      this.savingAvailability = true
      try {
        // Build hours array from start/end
        const hours = []
        const startIdx = this.hoursOptions.indexOf(this.availabilityForm.startHour)
        const endIdx = this.hoursOptions.indexOf(this.availabilityForm.endHour)

        for (let i = startIdx; i < endIdx && i < this.hoursOptions.length - 1; i++) {
          hours.push(`${this.hoursOptions[i]}-${this.hoursOptions[i + 1]}`)
        }

        const data = {
          reseller_id: this.editingAvailabilityReseller.id,
          company_id: this.editingAvailabilityReseller.company_id,
          days_input: this.availabilityForm.days,
          hours_input: hours,
          default_capacity_per_hour: this.availabilityForm.capacity,
          default_address: this.availabilityForm.defaultAddress,
          default_address_maps_url: this.availabilityForm.mapsUrl,
          active: this.availabilityForm.active
        }

        const existing = this.getResellerAvailability(this.editingAvailabilityReseller.id)

        if (existing) {
          const { error } = await this.supabase
            .from('booking_availability')
            .update(data)
            .eq('id', existing.id)

          if (error) throw error
        } else {
          const { error } = await this.supabase
            .from('booking_availability')
            .insert([data])

          if (error) throw error
        }

        this.showToast(this.t.availability_saved)
        await this.loadData()
        this.closeAvailabilityModal()
      } catch (err) {
        console.error('Error saving availability:', err)
        this.showToast(this.t.error_saving, 'error')
      } finally {
        this.savingAvailability = false
      }
    },

    // ===== EXCEPTIONS =====
    async addException() {
      if (!this.exceptionForm.startDate || !this.exceptionForm.endDate) {
        this.showToast(this.t.error_required_fields, 'error')
        return
      }

      const availability = this.getResellerAvailability(this.editingAvailabilityReseller.id)
      if (!availability) {
        this.showToast(this.t.error_saving, 'error')
        return
      }

      this.savingException = true
      try {
        // Build datetime strings
        let startDatetime = `${this.exceptionForm.startDate}T${this.exceptionForm.startTime || '00:00'}:00`
        let endDatetime = `${this.exceptionForm.endDate}T${this.exceptionForm.endTime || '23:59'}:00`

        const { error } = await this.supabase
          .from('booking_availability_exceptions')
          .insert([{
            booking_availability_id: availability.id,
            start_datetime: startDatetime,
            end_datetime: endDatetime,
            is_unavailable: this.exceptionForm.isUnavailable,
            capacity_override: this.exceptionForm.isUnavailable ? null : this.exceptionForm.capacityOverride,
            description: this.exceptionForm.description
          }])

        if (error) throw error

        this.showToast(this.t.exception_added)
        await this.loadData()
        this.currentExceptions = this.getResellerExceptions(this.editingAvailabilityReseller.id)
        this.exceptionForm = this.getEmptyExceptionForm()
        this.showExceptionForm = false
      } catch (err) {
        console.error('Error adding exception:', err)
        this.showToast(this.t.error_saving, 'error')
      } finally {
        this.savingException = false
      }
    },

    async deleteException(exceptionId) {
      try {
        const { error } = await this.supabase
          .from('booking_availability_exceptions')
          .delete()
          .eq('id', exceptionId)

        if (error) throw error

        this.showToast(this.t.exception_deleted)
        await this.loadData()
        this.currentExceptions = this.getResellerExceptions(this.editingAvailabilityReseller.id)
      } catch (err) {
        console.error('Error deleting exception:', err)
        this.showToast(this.t.error_deleting, 'error')
      }
    }
  }
}
</script>

<style scoped>
/* ===== BASE STYLES WITH CSS VARIABLES ===== */
.admin-reseller-container {
  /* CSS Variables - defined on container for scoped styles */
  --primary: #f97316;
  --primary-dark: #ea580c;
  --success: #22c55e;
  --danger: #ef4444;
  --warning: #f59e0b;
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-600: #4b5563;
  --gray-700: #374151;
  --gray-800: #1f2937;
  --gray-900: #111827;
  --white: #ffffff;
  --radius: 8px;
  --radius-lg: 12px;
  --shadow: 0 1px 3px rgba(0,0,0,0.1);
  --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1);

  /* Base container styles */
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
  color: #111827;
  background: #f9fafb;
  min-height: 100vh;
}

/* ===== HEADER ===== */
.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 4px 0;
}

.page-subtitle {
  font-size: 0.95rem;
  color: var(--gray-500);
  margin: 0;
}

/* ===== LOADING & ERROR ===== */
.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--gray-200);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-message {
  color: var(--danger);
  margin-bottom: 16px;
}

/* ===== TOAST ===== */
.toast-notification {
  position: fixed;
  top: 24px;
  right: 24px;
  padding: 12px 20px;
  border-radius: var(--radius);
  color: var(--white);
  font-weight: 500;
  z-index: 1000;
  box-shadow: var(--shadow-lg);
}

.toast-notification.success { background: var(--success); }
.toast-notification.error { background: var(--danger); }
.toast-notification.warning { background: var(--warning); }

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

/* ===== TABS ===== */
.tabs-container {
  margin-bottom: 24px;
}

.tabs-nav {
  display: flex;
  gap: 4px;
  background: var(--gray-100);
  padding: 4px;
  border-radius: var(--radius-lg);
  margin-bottom: 16px;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: transparent;
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--gray-600);
  transition: all 0.2s;
}

.tab-btn:hover {
  background: var(--white);
  color: var(--gray-900);
}

.tab-btn.active {
  background: var(--white);
  color: var(--gray-900);
  box-shadow: var(--shadow);
}

.tab-count {
  background: var(--gray-200);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
}

.tab-btn.active .tab-count {
  background: var(--primary);
  color: var(--white);
}

/* Mobile tabs */
.mobile-tabs {
  display: none;
  position: relative;
}

.mobile-tab-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 12px 16px;
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius);
  font-size: 1rem;
  cursor: pointer;
}

.mobile-tab-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius);
  margin-top: 4px;
  box-shadow: var(--shadow-lg);
  z-index: 100;
}

.mobile-tab-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
}

.mobile-tab-item.active {
  background: var(--gray-50);
  color: var(--primary);
}

/* ===== TOOLBAR ===== */
.toolbar {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 200px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--gray-400);
}

.search-input {
  width: 100%;
  padding: 10px 12px 10px 40px;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius);
  font-size: 0.9rem;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
}

.toolbar-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.filter-select {
  padding: 10px 12px;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius);
  font-size: 0.9rem;
  background: var(--white);
  cursor: pointer;
}

/* ===== BUTTONS ===== */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border: none;
  border-radius: var(--radius);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: var(--gray-900);
  color: var(--white);
}

.btn-primary:hover {
  background: var(--gray-800);
}

.btn-secondary {
  background: var(--white);
  color: var(--gray-700);
  border: 1px solid var(--gray-200);
}

.btn-secondary:hover {
  background: var(--gray-50);
  border-color: var(--gray-300);
}

.btn-danger {
  background: var(--danger);
  color: var(--white);
}

.btn-sm {
  padding: 6px 12px;
  font-size: 0.8rem;
}

.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  background: transparent;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius);
  cursor: pointer;
  color: var(--gray-600);
  transition: all 0.2s;
}

.btn-icon:hover {
  background: var(--gray-50);
  color: var(--gray-900);
}

.btn-icon.btn-sm {
  width: 32px;
  height: 32px;
}

.btn-danger-icon:hover {
  background: #fef2f2;
  color: var(--danger);
  border-color: var(--danger);
}

.btn-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
  color: var(--gray-500);
}

.btn-close:hover {
  background: var(--gray-100);
  color: var(--gray-900);
}

.btn-remove {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  color: var(--gray-400);
}

.btn-remove:hover {
  background: #fef2f2;
  color: var(--danger);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ===== COMPANIES LIST ===== */
.companies-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.company-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  margin-bottom: 12px;
}

.company-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  border-color: #d1d5db;
}

.company-card.expanded {
  border-color: #f97316;
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.15);
}

.company-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  cursor: pointer;
}

.company-info {
  flex: 1;
}

.company-name-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 4px;
}

.expand-icon {
  color: var(--gray-400);
  font-size: 0.75rem;
}

.company-name {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

.company-meta {
  display: flex;
  gap: 16px;
  font-size: 0.85rem;
  color: var(--gray-500);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* ===== STATUS BADGES ===== */
.status-badge,
.status-badge-sm {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-badge-sm {
  padding: 2px 8px;
  font-size: 0.7rem;
}

.status-active {
  background: #dcfce7;
  color: #166534;
}

.status-inactive {
  background: #f3f4f6;
  color: #4b5563;
}

/* ===== COMPANY DETAILS ===== */
.company-details {
  padding: 0 20px 20px;
  border-top: 1px solid var(--gray-100);
}

.detail-section {
  padding: 16px 0;
  border-bottom: 1px solid var(--gray-100);
}

.detail-section:last-child {
  border-bottom: none;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.section-header h4 {
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0;
  color: var(--gray-700);
}

/* ===== RESELLERS LIST (in company) ===== */
.resellers-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.reseller-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: var(--gray-50);
  border-radius: var(--radius);
}

.reseller-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.reseller-avatar {
  font-size: 1.25rem;
}

.reseller-avatar-sm {
  font-size: 1rem;
  margin-right: 8px;
}

.reseller-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.reseller-name {
  font-weight: 500;
  font-size: 0.9rem;
}

.reseller-email,
.reseller-phone {
  font-size: 0.8rem;
  color: var(--gray-500);
}

.reseller-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.availability-badge {
  font-size: 0.75rem;
  color: var(--gray-600);
  background: var(--gray-100);
  padding: 4px 8px;
  border-radius: 4px;
}

.availability-badge.not-set {
  color: var(--gray-400);
  font-style: italic;
}

/* ===== LOCATIONS GRID ===== */
.locations-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.location-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: var(--gray-100);
  border-radius: var(--radius);
  font-size: 0.85rem;
}

.location-icon {
  font-size: 0.9rem;
}

/* ===== TABLE ===== */
.resellers-table-container {
  overflow-x: auto;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.resellers-table {
  width: 100%;
  border-collapse: collapse;
}

.resellers-table th,
.resellers-table td {
  padding: 14px 16px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.resellers-table th {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6b7280;
  background: #f3f4f6;
  border-bottom: 2px solid #e5e7eb;
}

/* Zebra striping for better readability */
.resellers-table tbody tr:nth-child(even) {
  background: #f9fafb;
}

.resellers-table tbody tr:hover {
  background: #fef3e2;
}

.name-cell {
  display: flex;
  align-items: center;
  font-weight: 500;
}

.actions-cell {
  display: flex;
  gap: 4px;
}

/* Mobile cards */
.resellers-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.reseller-card-mobile {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  transition: box-shadow 0.2s;
}

.reseller-card-mobile:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.card-header-mobile {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
}

.card-title-mobile {
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-title-mobile > div {
  display: flex;
  flex-direction: column;
}

.reseller-company {
  font-size: 0.8rem;
  color: var(--gray-500);
}

.card-body-mobile {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
}

.card-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
}

.card-label {
  color: var(--gray-500);
}

.card-actions-mobile {
  display: flex;
  gap: 8px;
}

.card-actions-mobile .btn {
  flex: 1;
  justify-content: center;
}

/* ===== EMPTY STATES ===== */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  text-align: center;
  color: var(--gray-500);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 12px;
}

.empty-state-small {
  padding: 20px;
  text-align: center;
  color: var(--gray-400);
  font-size: 0.85rem;
}

/* ===== PAGINATION ===== */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 20px;
}

.page-info {
  font-size: 0.85rem;
  color: var(--gray-600);
}

/* ===== MODAL ===== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal {
  background: #ffffff;
  border-radius: 12px;
  width: 100%;
  max-width: 560px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid #e5e7eb;
}

.modal-sm {
  max-width: 420px;
}

.modal-lg {
  max-width: 680px;
}

.modal-confirm {
  max-width: 400px;
  text-align: center;
  padding: 32px;
  background: #ffffff;
}

.confirm-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
  background: #ffffff;
}

.modal-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: #111827;
}

.modal-subtitle {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 4px 0 0;
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
  background: #ffffff;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

.modal-footer-centered {
  justify-content: center;
}

/* ===== FORMS ===== */
.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 6px;
  color: #374151;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-row .flex-2 {
  grid-column: span 1;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: inherit;
  background: #ffffff;
  color: #111827;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #f97316;
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-hint {
  display: block;
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 4px;
}

.checkboxes {
  display: flex;
  gap: 24px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

/* ===== DAYS GRID ===== */
.days-grid {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.day-checkbox {
  position: relative;
}

.day-checkbox input {
  position: absolute;
  opacity: 0;
}

.day-label {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius);
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.day-checkbox input:checked + .day-label {
  background: var(--gray-900);
  color: var(--white);
  border-color: var(--gray-900);
}

/* ===== LOCATIONS CHECKLIST ===== */
.modal-search {
  margin-bottom: 16px;
}

.locations-checklist {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius);
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--gray-100);
  cursor: pointer;
  transition: background 0.15s;
}

.checkbox-item:last-child {
  border-bottom: none;
}

.checkbox-item:hover {
  background: var(--gray-50);
}

.checkbox-item.selected {
  background: #fef3e2;
}

/* ===== AVAILABILITY SECTION ===== */
.availability-section,
.exceptions-section {
  margin-bottom: 24px;
}

.availability-section h3,
.exceptions-section h3 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--gray-200);
}

/* ===== EXCEPTION FORM ===== */
.exception-form {
  background: var(--gray-50);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius);
  padding: 16px;
  margin-bottom: 16px;
}

.exception-form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
}

/* ===== EXCEPTIONS LIST ===== */
.exceptions-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.exception-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius);
}

.exception-info {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.exception-icon {
  font-size: 1rem;
}

.exception-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.exception-dates {
  font-size: 0.9rem;
  font-weight: 500;
}

.exception-description {
  font-size: 0.8rem;
  color: var(--gray-500);
}

.exception-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.exception-type-badge {
  font-size: 0.75rem;
  padding: 4px 8px;
  border-radius: 4px;
}

.exception-type-badge.unavailable {
  background: #fef2f2;
  color: var(--danger);
}

.exception-type-badge.capacity {
  background: #fef3e2;
  color: #ea580c;
}

/* ===== EXPAND TRANSITION ===== */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 1000px;
}

/* ===== RESPONSIVE ===== */
.desktop-only { display: table; }
.mobile-only { display: none; }
.desktop-tabs { display: flex; }
.mobile-tabs { display: none; }

@media (max-width: 768px) {
  .admin-reseller-container {
    padding: 16px;
  }

  .desktop-only { display: none !important; }
  .mobile-only { display: flex !important; }
  .desktop-tabs { display: none !important; }
  .mobile-tabs { display: block !important; }

  .page-title {
    font-size: 1.5rem;
  }

  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .toolbar-actions {
    flex-direction: column;
  }

  .toolbar-actions .btn {
    width: 100%;
    justify-content: center;
  }

  .btn-text {
    display: inline;
  }

  .company-header {
    padding: 12px 16px;
  }

  .company-meta {
    flex-wrap: wrap;
    gap: 8px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .modal-overlay {
    padding: 12px;
  }

  .modal {
    max-height: 95vh;
  }

  .reseller-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .reseller-actions {
    width: 100%;
    justify-content: space-between;
  }

  .days-grid {
    justify-content: center;
  }
}
</style>
