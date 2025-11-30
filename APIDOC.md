# TaxSyncQC API Documentation

## Overview
TaxSyncQC is a command-line tool for calculating Quebec and Federal tax credits based on RL-1 or T4 slips. It provides accurate estimates for various tax benefits and RRSP impact calculations.

## Core Modules

### 1. Credit Calculator (`credit-calculator.js`)
Functions for calculating Quebec and Federal tax credits.

#### `calculateSolidarityCredit(income)`
- **Description**: Calculates the Quebec Solidarity Tax Credit
- **Parameters**: 
  - `income` (number): Annual income
- **Returns**: (number) Credit amount in dollars
- **Details**: 
  - Base amount: $531
  - Phases out between $57,965 and $64,125
  - Completely phased out at $64,125+

#### `calculateWorkPremium(income)`
- **Description**: Calculates the Quebec Work Premium
- **Parameters**: 
  - `income` (number): Annual income
- **Returns**: (number) Credit amount in dollars
- **Details**: 
  - 26% rate on income above $7,200
  - Capped at $728 for single filers
  - Phases out above $33,100 of eligible income

### 2. RRSP Calculator (`rrsp-calculator.js`)

#### `calculateRrspImpact(income, contribution)`
- **Description**: Calculates the tax impact of RRSP contributions
- **Parameters**: 
  - `income` (number): Annual income before RRSP contribution
  - `contribution` (number): RRSP contribution amount
- **Returns**: Object with:
  - `contribution`: Actual contribution (capped at min(income, $31,560))
  - `newIncome`: Income after RRSP deduction
  - `taxSaved`: Tax savings at marginal rate
  - `marginalRate`: Marginal tax rate applied
- **Details**: Uses 2025 combined Quebec + Federal marginal tax rates

### 3. RL-1 Parser (`rl1-parser.js`)

#### `parseRL1Text(text)`
- **Description**: Parses RL-1 slip text to extract key information
- **Parameters**: 
  - `text` (string): Text content of RL-1 slip
- **Returns**: Object with:
  - `income`: Employment income (from Case A)
  - `isValid()`: Function to check if parsed data is valid

### 4. Income Slip Parser (`income-slip-parser.js`)

#### `parseIncomeSlip(text)`
- **Description**: Auto-detects RL-1 or T4 slip and parses all key fields
- **Parameters**: 
  - `text` (string): Text content of income slip
- **Returns**: Object with:
  - `source`: 'RL-1', 'T4', or 'Unknown'
  - `employmentIncome`: Employment income amount
  - `qpp`: Quebec Pension Plan contributions
  - `cpp`: Canada Pension Plan contributions
  - `ei`: Employment Insurance contributions
  - `ppip`: Quebec Parental Insurance Plan contributions
  - `unionDues`: Union dues amount
  - `sin`: Social Insurance Number
  - `isValid()`: Function to check if parsed data is valid
  - `warnings()`: Function to get warnings about missing data

### 5. Internationalization (`i18n.js`)

#### `t(key, lang = 'en')`
- **Description**: Returns translated string for the given key
- **Parameters**: 
  - `key` (string): Translation key
  - `lang` (string): Language code ('en' or 'fr')
- **Returns**: (string) Translated string or the key if not found

## Command Line Interface

### Usage
```bash
node cli.js --slip "Box A: 60000" [--rrsp 5000]
```

### Options
- `--slip`: Text of income slip to parse (required)
- `--rrsp`: RRSP contribution amount (optional)

### Examples
```bash
# Basic calculation
node cli.js --slip "Box A: 60000"

# With RRSP contribution
node cli.js --slip "Box A: 60000" --rrsp 5000

# With different slip format
node cli.js --slip "Case A: 55000" --rrsp 3000
```

## Tax Calculation Logic

### Marginal Tax Rates (2025)
The tool uses combined Quebec + Federal marginal tax rates:
- Up to $51,268: 28.85%
- $51,268 - $57,965: 33.25% (solidarity phase-in)
- $57,965 - $110,972: 38.85%
- $110,972 - $165,430: 43.85%
- $165,430 - $235,430: 48.35%
- Above $235,430: 53.35%

### Credits Calculated
1. Quebec Solidarity Credit (up to $531)
2. Quebec Work Premium (up to $728)
3. Federal Basic Personal Amount savings
4. Canada Workers Benefit (CWB/PTE)

## Testing
Run tests with:
```bash
npm test
```

The test suite includes tests for all core calculation functions, parsers, and internationalization features.