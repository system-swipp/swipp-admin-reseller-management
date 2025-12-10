/**
 * Internationalization (i18n) translations for Swipp Admin Reseller Management Component
 * Supported languages: no (Norwegian), en (English), sv (Swedish), da (Danish)
 *
 * Usage in component:
 *   import { i18n } from './i18n.js'
 *   computed: {
 *     t() { return i18n[this.language] || i18n['no'] }
 *   }
 *   In template: {{ t.page_title }}
 */

export const i18n = {
  no: {
    // Page Header
    page_title: 'Forhandleradministrasjon',
    page_subtitle: 'Administrer selskaper, resellers og tilgjengelighet',

    // Loading & Errors
    loading: 'Laster data...',
    error: 'Noe gikk galt',
    try_again: 'Prøv igjen',
    no_data: 'Ingen data tilgjengelig',

    // Tabs
    tab_companies: 'Selskaper',
    tab_resellers: 'Resellers',

    // Search & Filters
    search_placeholder: 'Søk...',
    search_companies: 'Søk selskaper...',
    search_resellers: 'Søk resellers...',
    filter_all: 'Alle',
    filter_active: 'Aktive',
    filter_inactive: 'Inaktive',
    filter_status: 'Status',
    filter_country: 'Land',
    filter_all_countries: 'Alle land',
    filter_all_companies: 'Alle selskaper',

    // Auth & Access
    error_not_admin: 'Du må være logget inn som administrator for å se denne siden.',
    error_no_session: 'Du er ikke logget inn. Vennligst logg inn først.',

    // Tooltips
    tooltip_edit_events: 'Rediger events',
    tooltip_edit_reseller: 'Rediger reseller',
    tooltip_edit_company: 'Rediger selskap',

    // Companies
    companies_title: 'Selskaper',
    company_count: 'selskaper',
    new_company: 'Nytt selskap',
    edit_company: 'Rediger selskap',
    company_name: 'Selskapsnavn',
    company_legal_name: 'Juridisk navn',
    company_display_name: 'Visningsnavn',
    org_number: 'Org.nummer',
    locations_count: 'lokasjoner',
    resellers_count: 'resellers',
    is_reseller: 'Er forhandler',
    is_customer: 'Er kunde',

    // Resellers
    resellers_title: 'Resellers',
    reseller_count: 'resellers',
    new_reseller: 'Ny reseller',
    edit_reseller: 'Rediger reseller',
    first_name: 'Fornavn',
    last_name: 'Etternavn',
    full_name: 'Navn',
    email: 'E-post',
    phone: 'Telefon',
    company: 'Selskap',
    select_company: 'Velg selskap...',
    comment: 'Kommentar',
    comment_placeholder: 'Internt notat (kun synlig for admin)',

    // Locations
    locations_title: 'Lokasjoner',
    add_location: 'Legg til',
    remove_location: 'Fjern',
    no_locations: 'Ingen lokasjoner tilknyttet',
    select_locations: 'Velg lokasjoner',
    available_locations: 'Tilgjengelige lokasjoner',

    // Availability
    availability_title: 'Tilgjengelighet',
    availability_not_set: 'Ikke satt opp',
    edit_availability: 'Rediger tilgjengelighet',
    days: 'Dager',
    hours: 'Timer',
    from_time: 'Fra',
    to_time: 'Til',
    capacity: 'Kapasitet',
    capacity_per_hour: 'bookinger per time',
    default_address: 'Standard adresse',
    maps_url: 'Google Maps URL',
    availability_active: 'Tilgjengelighet aktiv',

    // Days of week
    monday: 'Mandag',
    tuesday: 'Tirsdag',
    wednesday: 'Onsdag',
    thursday: 'Torsdag',
    friday: 'Fredag',
    saturday: 'Lørdag',
    sunday: 'Søndag',
    mon: 'Ma',
    tue: 'Ti',
    wed: 'On',
    thu: 'To',
    fri: 'Fr',
    sat: 'Lø',
    sun: 'Sø',

    // Exceptions
    exceptions_title: 'Unntak / Utilgjengelige perioder',
    add_exception: 'Legg til unntak',
    exception_type: 'Type',
    exception_unavailable: 'Utilgjengelig',
    exception_capacity: 'Justert kapasitet',
    exception_period: 'Periode',
    exception_full_day: 'Hel dag(er)',
    exception_specific_hours: 'Spesifikke timer',
    exception_from_date: 'Fra dato',
    exception_to_date: 'Til dato',
    exception_from_time: 'Fra kl.',
    exception_to_time: 'Til kl.',
    exception_description: 'Beskrivelse',
    exception_description_placeholder: 'F.eks. Juleferie, møte, etc.',
    no_exceptions: 'Ingen unntak registrert',

    // Status
    status: 'Status',
    active: 'Aktiv',
    inactive: 'Inaktiv',

    // Address fields
    address: 'Adresse',
    address_line_1: 'Adresselinje 1',
    address_line_2: 'Adresselinje 2',
    postal_code: 'Postnummer',
    city: 'By',
    country: 'Land',

    // Countries
    country_NO: 'Norge',
    country_SE: 'Sverige',
    country_DK: 'Danmark',
    country_FI: 'Finland',

    // Actions
    save: 'Lagre',
    saving: 'Lagrer...',
    cancel: 'Avbryt',
    close: 'Lukk',
    delete: 'Slett',
    confirm: 'Bekreft',
    add: 'Legg til',
    edit: 'Rediger',
    remove: 'Fjern',

    // Confirmations
    confirm_delete: 'Bekreft sletting',
    confirm_delete_company: 'Er du sikker på at du vil slette dette selskapet?',
    confirm_delete_reseller: 'Er du sikker på at du vil slette denne reselleren?',
    confirm_delete_exception: 'Er du sikker på at du vil slette dette unntaket?',
    confirm_remove_location: 'Er du sikker på at du vil fjerne denne lokasjonen?',

    // Success messages
    saved_successfully: 'Lagret!',
    company_created: 'Selskap opprettet',
    company_updated: 'Selskap oppdatert',
    company_deleted: 'Selskap slettet',
    reseller_created: 'Reseller opprettet',
    reseller_updated: 'Reseller oppdatert',
    reseller_deleted: 'Reseller slettet',
    availability_saved: 'Tilgjengelighet lagret',
    location_added: 'Lokasjon lagt til',
    location_removed: 'Lokasjon fjernet',
    exception_added: 'Unntak lagt til',
    exception_deleted: 'Unntak slettet',

    // Error messages
    error_loading: 'Kunne ikke laste data',
    error_saving: 'Kunne ikke lagre',
    error_deleting: 'Kunne ikke slette',
    error_required_fields: 'Vennligst fyll ut alle påkrevde felt',
    error_invalid_email: 'Ugyldig e-postadresse',
    error_duplicate_email: 'E-postadressen er allerede i bruk',

    // Empty states
    no_companies: 'Ingen selskaper funnet',
    no_resellers: 'Ingen resellers funnet',
    no_resellers_in_company: 'Ingen resellers i dette selskapet',

    // Misc
    required: 'Påkrevd',
    optional: 'Valgfritt',
    website: 'Nettside'
  },

  en: {
    // Page Header
    page_title: 'Reseller Management',
    page_subtitle: 'Manage companies, resellers and availability',

    // Loading & Errors
    loading: 'Loading data...',
    error: 'Something went wrong',
    try_again: 'Try again',
    no_data: 'No data available',

    // Tabs
    tab_companies: 'Companies',
    tab_resellers: 'Resellers',

    // Search & Filters
    search_placeholder: 'Search...',
    search_companies: 'Search companies...',
    search_resellers: 'Search resellers...',
    filter_all: 'All',
    filter_active: 'Active',
    filter_inactive: 'Inactive',
    filter_status: 'Status',
    filter_country: 'Country',
    filter_all_countries: 'All countries',
    filter_all_companies: 'All companies',

    // Auth & Access
    error_not_admin: 'You must be logged in as an administrator to view this page.',
    error_no_session: 'You are not logged in. Please log in first.',

    // Tooltips
    tooltip_edit_events: 'Edit events',
    tooltip_edit_reseller: 'Edit reseller',
    tooltip_edit_company: 'Edit company',

    // Companies
    companies_title: 'Companies',
    company_count: 'companies',
    new_company: 'New company',
    edit_company: 'Edit company',
    company_name: 'Company name',
    company_legal_name: 'Legal name',
    company_display_name: 'Display name',
    org_number: 'Org. number',
    locations_count: 'locations',
    resellers_count: 'resellers',
    is_reseller: 'Is reseller',
    is_customer: 'Is customer',

    // Resellers
    resellers_title: 'Resellers',
    reseller_count: 'resellers',
    new_reseller: 'New reseller',
    edit_reseller: 'Edit reseller',
    first_name: 'First name',
    last_name: 'Last name',
    full_name: 'Name',
    email: 'Email',
    phone: 'Phone',
    company: 'Company',
    select_company: 'Select company...',
    comment: 'Comment',
    comment_placeholder: 'Internal note (only visible to admin)',

    // Locations
    locations_title: 'Locations',
    add_location: 'Add',
    remove_location: 'Remove',
    no_locations: 'No locations assigned',
    select_locations: 'Select locations',
    available_locations: 'Available locations',

    // Availability
    availability_title: 'Availability',
    availability_not_set: 'Not configured',
    edit_availability: 'Edit availability',
    days: 'Days',
    hours: 'Hours',
    from_time: 'From',
    to_time: 'To',
    capacity: 'Capacity',
    capacity_per_hour: 'bookings per hour',
    default_address: 'Default address',
    maps_url: 'Google Maps URL',
    availability_active: 'Availability active',

    // Days of week
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
    mon: 'Mon',
    tue: 'Tue',
    wed: 'Wed',
    thu: 'Thu',
    fri: 'Fri',
    sat: 'Sat',
    sun: 'Sun',

    // Exceptions
    exceptions_title: 'Exceptions / Unavailable periods',
    add_exception: 'Add exception',
    exception_type: 'Type',
    exception_unavailable: 'Unavailable',
    exception_capacity: 'Adjusted capacity',
    exception_period: 'Period',
    exception_full_day: 'Full day(s)',
    exception_specific_hours: 'Specific hours',
    exception_from_date: 'From date',
    exception_to_date: 'To date',
    exception_from_time: 'From time',
    exception_to_time: 'To time',
    exception_description: 'Description',
    exception_description_placeholder: 'E.g. Christmas holiday, meeting, etc.',
    no_exceptions: 'No exceptions registered',

    // Status
    status: 'Status',
    active: 'Active',
    inactive: 'Inactive',

    // Address fields
    address: 'Address',
    address_line_1: 'Address line 1',
    address_line_2: 'Address line 2',
    postal_code: 'Postal code',
    city: 'City',
    country: 'Country',

    // Countries
    country_NO: 'Norway',
    country_SE: 'Sweden',
    country_DK: 'Denmark',
    country_FI: 'Finland',

    // Actions
    save: 'Save',
    saving: 'Saving...',
    cancel: 'Cancel',
    close: 'Close',
    delete: 'Delete',
    confirm: 'Confirm',
    add: 'Add',
    edit: 'Edit',
    remove: 'Remove',

    // Confirmations
    confirm_delete: 'Confirm deletion',
    confirm_delete_company: 'Are you sure you want to delete this company?',
    confirm_delete_reseller: 'Are you sure you want to delete this reseller?',
    confirm_delete_exception: 'Are you sure you want to delete this exception?',
    confirm_remove_location: 'Are you sure you want to remove this location?',

    // Success messages
    saved_successfully: 'Saved!',
    company_created: 'Company created',
    company_updated: 'Company updated',
    company_deleted: 'Company deleted',
    reseller_created: 'Reseller created',
    reseller_updated: 'Reseller updated',
    reseller_deleted: 'Reseller deleted',
    availability_saved: 'Availability saved',
    location_added: 'Location added',
    location_removed: 'Location removed',
    exception_added: 'Exception added',
    exception_deleted: 'Exception deleted',

    // Error messages
    error_loading: 'Could not load data',
    error_saving: 'Could not save',
    error_deleting: 'Could not delete',
    error_required_fields: 'Please fill in all required fields',
    error_invalid_email: 'Invalid email address',
    error_duplicate_email: 'Email address is already in use',

    // Empty states
    no_companies: 'No companies found',
    no_resellers: 'No resellers found',
    no_resellers_in_company: 'No resellers in this company',

    // Misc
    required: 'Required',
    optional: 'Optional',
    website: 'Website'
  },

  sv: {
    // Page Header
    page_title: 'Återförsäljarhantering',
    page_subtitle: 'Hantera företag, återförsäljare och tillgänglighet',

    // Loading & Errors
    loading: 'Laddar data...',
    error: 'Något gick fel',
    try_again: 'Försök igen',
    no_data: 'Ingen data tillgänglig',

    // Tabs
    tab_companies: 'Företag',
    tab_resellers: 'Återförsäljare',

    // Search & Filters
    search_placeholder: 'Sök...',
    search_companies: 'Sök företag...',
    search_resellers: 'Sök återförsäljare...',
    filter_all: 'Alla',
    filter_active: 'Aktiva',
    filter_inactive: 'Inaktiva',
    filter_status: 'Status',
    filter_country: 'Land',
    filter_all_countries: 'Alla länder',
    filter_all_companies: 'Alla företag',

    // Auth & Access
    error_not_admin: 'Du måste vara inloggad som administratör för att se denna sida.',
    error_no_session: 'Du är inte inloggad. Vänligen logga in först.',

    // Tooltips
    tooltip_edit_events: 'Redigera events',
    tooltip_edit_reseller: 'Redigera återförsäljare',
    tooltip_edit_company: 'Redigera företag',

    // Companies
    companies_title: 'Företag',
    company_count: 'företag',
    new_company: 'Nytt företag',
    edit_company: 'Redigera företag',
    company_name: 'Företagsnamn',
    company_legal_name: 'Juridiskt namn',
    company_display_name: 'Visningsnamn',
    org_number: 'Org.nummer',
    locations_count: 'platser',
    resellers_count: 'återförsäljare',
    is_reseller: 'Är återförsäljare',
    is_customer: 'Är kund',

    // Resellers
    resellers_title: 'Återförsäljare',
    reseller_count: 'återförsäljare',
    new_reseller: 'Ny återförsäljare',
    edit_reseller: 'Redigera återförsäljare',
    first_name: 'Förnamn',
    last_name: 'Efternamn',
    full_name: 'Namn',
    email: 'E-post',
    phone: 'Telefon',
    company: 'Företag',
    select_company: 'Välj företag...',
    comment: 'Kommentar',
    comment_placeholder: 'Intern anteckning (endast synlig för admin)',

    // Locations
    locations_title: 'Platser',
    add_location: 'Lägg till',
    remove_location: 'Ta bort',
    no_locations: 'Inga platser tilldelade',
    select_locations: 'Välj platser',
    available_locations: 'Tillgängliga platser',

    // Availability
    availability_title: 'Tillgänglighet',
    availability_not_set: 'Ej konfigurerad',
    edit_availability: 'Redigera tillgänglighet',
    days: 'Dagar',
    hours: 'Timmar',
    from_time: 'Från',
    to_time: 'Till',
    capacity: 'Kapacitet',
    capacity_per_hour: 'bokningar per timme',
    default_address: 'Standardadress',
    maps_url: 'Google Maps URL',
    availability_active: 'Tillgänglighet aktiv',

    // Days of week
    monday: 'Måndag',
    tuesday: 'Tisdag',
    wednesday: 'Onsdag',
    thursday: 'Torsdag',
    friday: 'Fredag',
    saturday: 'Lördag',
    sunday: 'Söndag',
    mon: 'Mån',
    tue: 'Tis',
    wed: 'Ons',
    thu: 'Tor',
    fri: 'Fre',
    sat: 'Lör',
    sun: 'Sön',

    // Exceptions
    exceptions_title: 'Undantag / Otillgängliga perioder',
    add_exception: 'Lägg till undantag',
    exception_type: 'Typ',
    exception_unavailable: 'Otillgänglig',
    exception_capacity: 'Justerad kapacitet',
    exception_period: 'Period',
    exception_full_day: 'Hel dag(ar)',
    exception_specific_hours: 'Specifika timmar',
    exception_from_date: 'Från datum',
    exception_to_date: 'Till datum',
    exception_from_time: 'Från tid',
    exception_to_time: 'Till tid',
    exception_description: 'Beskrivning',
    exception_description_placeholder: 'T.ex. Julledighet, möte, etc.',
    no_exceptions: 'Inga undantag registrerade',

    // Status
    status: 'Status',
    active: 'Aktiv',
    inactive: 'Inaktiv',

    // Address fields
    address: 'Adress',
    address_line_1: 'Adressrad 1',
    address_line_2: 'Adressrad 2',
    postal_code: 'Postnummer',
    city: 'Stad',
    country: 'Land',

    // Countries
    country_NO: 'Norge',
    country_SE: 'Sverige',
    country_DK: 'Danmark',
    country_FI: 'Finland',

    // Actions
    save: 'Spara',
    saving: 'Sparar...',
    cancel: 'Avbryt',
    close: 'Stäng',
    delete: 'Ta bort',
    confirm: 'Bekräfta',
    add: 'Lägg till',
    edit: 'Redigera',
    remove: 'Ta bort',

    // Confirmations
    confirm_delete: 'Bekräfta borttagning',
    confirm_delete_company: 'Är du säker på att du vill ta bort detta företag?',
    confirm_delete_reseller: 'Är du säker på att du vill ta bort denna återförsäljare?',
    confirm_delete_exception: 'Är du säker på att du vill ta bort detta undantag?',
    confirm_remove_location: 'Är du säker på att du vill ta bort denna plats?',

    // Success messages
    saved_successfully: 'Sparat!',
    company_created: 'Företag skapat',
    company_updated: 'Företag uppdaterat',
    company_deleted: 'Företag borttaget',
    reseller_created: 'Återförsäljare skapad',
    reseller_updated: 'Återförsäljare uppdaterad',
    reseller_deleted: 'Återförsäljare borttagen',
    availability_saved: 'Tillgänglighet sparad',
    location_added: 'Plats tillagd',
    location_removed: 'Plats borttagen',
    exception_added: 'Undantag tillagt',
    exception_deleted: 'Undantag borttaget',

    // Error messages
    error_loading: 'Kunde inte ladda data',
    error_saving: 'Kunde inte spara',
    error_deleting: 'Kunde inte ta bort',
    error_required_fields: 'Vänligen fyll i alla obligatoriska fält',
    error_invalid_email: 'Ogiltig e-postadress',
    error_duplicate_email: 'E-postadressen används redan',

    // Empty states
    no_companies: 'Inga företag hittades',
    no_resellers: 'Inga återförsäljare hittades',
    no_resellers_in_company: 'Inga återförsäljare i detta företag',

    // Misc
    required: 'Obligatorisk',
    optional: 'Valfritt',
    website: 'Webbplats'
  },

  da: {
    // Page Header
    page_title: 'Forhandleradministration',
    page_subtitle: 'Administrer virksomheder, forhandlere og tilgængelighed',

    // Loading & Errors
    loading: 'Indlæser data...',
    error: 'Noget gik galt',
    try_again: 'Prøv igen',
    no_data: 'Ingen data tilgængelig',

    // Tabs
    tab_companies: 'Virksomheder',
    tab_resellers: 'Forhandlere',

    // Search & Filters
    search_placeholder: 'Søg...',
    search_companies: 'Søg virksomheder...',
    search_resellers: 'Søg forhandlere...',
    filter_all: 'Alle',
    filter_active: 'Aktive',
    filter_inactive: 'Inaktive',
    filter_status: 'Status',
    filter_country: 'Land',
    filter_all_countries: 'Alle lande',
    filter_all_companies: 'Alle virksomheder',

    // Auth & Access
    error_not_admin: 'Du skal være logget ind som administrator for at se denne side.',
    error_no_session: 'Du er ikke logget ind. Log venligst ind først.',

    // Tooltips
    tooltip_edit_events: 'Rediger events',
    tooltip_edit_reseller: 'Rediger forhandler',
    tooltip_edit_company: 'Rediger virksomhed',

    // Companies
    companies_title: 'Virksomheder',
    company_count: 'virksomheder',
    new_company: 'Ny virksomhed',
    edit_company: 'Rediger virksomhed',
    company_name: 'Virksomhedsnavn',
    company_legal_name: 'Juridisk navn',
    company_display_name: 'Visningsnavn',
    org_number: 'CVR-nummer',
    locations_count: 'lokationer',
    resellers_count: 'forhandlere',
    is_reseller: 'Er forhandler',
    is_customer: 'Er kunde',

    // Resellers
    resellers_title: 'Forhandlere',
    reseller_count: 'forhandlere',
    new_reseller: 'Ny forhandler',
    edit_reseller: 'Rediger forhandler',
    first_name: 'Fornavn',
    last_name: 'Efternavn',
    full_name: 'Navn',
    email: 'E-mail',
    phone: 'Telefon',
    company: 'Virksomhed',
    select_company: 'Vælg virksomhed...',
    comment: 'Kommentar',
    comment_placeholder: 'Intern note (kun synlig for admin)',

    // Locations
    locations_title: 'Lokationer',
    add_location: 'Tilføj',
    remove_location: 'Fjern',
    no_locations: 'Ingen lokationer tildelt',
    select_locations: 'Vælg lokationer',
    available_locations: 'Tilgængelige lokationer',

    // Availability
    availability_title: 'Tilgængelighed',
    availability_not_set: 'Ikke konfigureret',
    edit_availability: 'Rediger tilgængelighed',
    days: 'Dage',
    hours: 'Timer',
    from_time: 'Fra',
    to_time: 'Til',
    capacity: 'Kapacitet',
    capacity_per_hour: 'bookinger per time',
    default_address: 'Standardadresse',
    maps_url: 'Google Maps URL',
    availability_active: 'Tilgængelighed aktiv',

    // Days of week
    monday: 'Mandag',
    tuesday: 'Tirsdag',
    wednesday: 'Onsdag',
    thursday: 'Torsdag',
    friday: 'Fredag',
    saturday: 'Lørdag',
    sunday: 'Søndag',
    mon: 'Man',
    tue: 'Tir',
    wed: 'Ons',
    thu: 'Tor',
    fri: 'Fre',
    sat: 'Lør',
    sun: 'Søn',

    // Exceptions
    exceptions_title: 'Undtagelser / Utilgængelige perioder',
    add_exception: 'Tilføj undtagelse',
    exception_type: 'Type',
    exception_unavailable: 'Utilgængelig',
    exception_capacity: 'Justeret kapacitet',
    exception_period: 'Periode',
    exception_full_day: 'Hel dag(e)',
    exception_specific_hours: 'Specifikke timer',
    exception_from_date: 'Fra dato',
    exception_to_date: 'Til dato',
    exception_from_time: 'Fra tid',
    exception_to_time: 'Til tid',
    exception_description: 'Beskrivelse',
    exception_description_placeholder: 'F.eks. Juleferie, møde, etc.',
    no_exceptions: 'Ingen undtagelser registreret',

    // Status
    status: 'Status',
    active: 'Aktiv',
    inactive: 'Inaktiv',

    // Address fields
    address: 'Adresse',
    address_line_1: 'Adresselinje 1',
    address_line_2: 'Adresselinje 2',
    postal_code: 'Postnummer',
    city: 'By',
    country: 'Land',

    // Countries
    country_NO: 'Norge',
    country_SE: 'Sverige',
    country_DK: 'Danmark',
    country_FI: 'Finland',

    // Actions
    save: 'Gem',
    saving: 'Gemmer...',
    cancel: 'Annuller',
    close: 'Luk',
    delete: 'Slet',
    confirm: 'Bekræft',
    add: 'Tilføj',
    edit: 'Rediger',
    remove: 'Fjern',

    // Confirmations
    confirm_delete: 'Bekræft sletning',
    confirm_delete_company: 'Er du sikker på, at du vil slette denne virksomhed?',
    confirm_delete_reseller: 'Er du sikker på, at du vil slette denne forhandler?',
    confirm_delete_exception: 'Er du sikker på, at du vil slette denne undtagelse?',
    confirm_remove_location: 'Er du sikker på, at du vil fjerne denne lokation?',

    // Success messages
    saved_successfully: 'Gemt!',
    company_created: 'Virksomhed oprettet',
    company_updated: 'Virksomhed opdateret',
    company_deleted: 'Virksomhed slettet',
    reseller_created: 'Forhandler oprettet',
    reseller_updated: 'Forhandler opdateret',
    reseller_deleted: 'Forhandler slettet',
    availability_saved: 'Tilgængelighed gemt',
    location_added: 'Lokation tilføjet',
    location_removed: 'Lokation fjernet',
    exception_added: 'Undtagelse tilføjet',
    exception_deleted: 'Undtagelse slettet',

    // Error messages
    error_loading: 'Kunne ikke indlæse data',
    error_saving: 'Kunne ikke gemme',
    error_deleting: 'Kunne ikke slette',
    error_required_fields: 'Udfyld venligst alle påkrævede felter',
    error_invalid_email: 'Ugyldig e-mailadresse',
    error_duplicate_email: 'E-mailadressen er allerede i brug',

    // Empty states
    no_companies: 'Ingen virksomheder fundet',
    no_resellers: 'Ingen forhandlere fundet',
    no_resellers_in_company: 'Ingen forhandlere i denne virksomhed',

    // Misc
    required: 'Påkrævet',
    optional: 'Valgfrit',
    website: 'Hjemmeside'
  }
}
