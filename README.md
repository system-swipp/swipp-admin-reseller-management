# Swipp Admin Reseller Management

WeWeb custom component for admin management of reseller companies, resellers, locations and availability.

## Features

- **Companies Tab**: View and manage reseller companies with expandable cards
- **Resellers Tab**: Flat list view of all resellers with table (desktop) / cards (mobile)
- **Location Management**: Add/remove locations to companies
- **Availability Settings**: Configure reseller availability (days, hours, capacity, address)
- **Exceptions**: Add unavailable periods or capacity adjustments per reseller
- **Multi-language**: Norwegian, English, Swedish, Danish

## Installation

```bash
cd swipp-admin-reseller-management
npm install
```

## Development

```bash
npm run serve
```

This starts a local WeWeb development server.

## Build

```bash
npm run build
```

## WeWeb Integration

1. Push to GitHub
2. In WeWeb Editor, add the component via GitHub URL
3. Configure Supabase URL and Anon Key in component settings

## Configuration

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| supabaseUrl | String | Swipp URL | Supabase project URL |
| supabaseAnonKey | String | Swipp Key | Supabase anon key |
| loginRedirectUrl | String | /login?redirect=/admin/forhandlere | Redirect for unauthenticated users |
| pageSize | Number | 25 | Items per page in tables |
| language | String | no | Language code (no, en, sv, da) |
| defaultCountry | String | NO | Default country code for new entries |

## Database Requirements

Required tables (all with RLS):
- `companies` - Company information with is_reseller, is_customer flags
- `resellers` - Reseller users linked to companies
- `locations` - Available locations
- `locations_companies` - Junction table for company-location relationships
- `booking_availability` - Reseller availability settings
- `availability_exceptions` - Unavailable periods per reseller

## Modals

The component includes 5 modals (all rendered within the component):

1. **Company Modal** - Create/edit company with all fields including country_code
2. **Reseller Modal** - Create/edit reseller with company selection
3. **Location Modal** - Add locations to a company via checkbox list
4. **Availability Modal** - Edit reseller availability + manage exceptions
5. **Exception Form** - Add unavailable periods or capacity adjustments

## Version History

- **1.0.0** (2025-12-10): Initial release

## License

MIT
