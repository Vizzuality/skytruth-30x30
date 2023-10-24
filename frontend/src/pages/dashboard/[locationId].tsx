import { useMemo, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';

import { Check, ChevronDown } from 'lucide-react';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';

import DashboardTable, { DashboardTableItem } from '@/components/dashboard-table';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandEmpty,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import DefaultLayout from '@/layouts/default';
import { cn } from '@/lib/classnames';

const locations = [
  {
    value: 'worldwide',
    label: 'Worldwide',
    type: 'region',
  },
  {
    label: 'Afghanistan',
    value: 'AF',
    type: 'country',
  },
  {
    label: 'Åland Islands',
    value: 'AX',
    type: 'country',
  },
  {
    label: 'Albania',
    value: 'AL',
    type: 'country',
  },
  {
    label: 'Algeria',
    value: 'DZ',
    type: 'country',
  },
  {
    label: 'American Samoa',
    value: 'AS',
    type: 'country',
  },
  {
    label: 'Andorra',
    value: 'AD',
    type: 'country',
  },
  {
    label: 'Angola',
    value: 'AO',
    type: 'country',
  },
  {
    label: 'Anguilla',
    value: 'AI',
    type: 'country',
  },
  {
    label: 'Antarctica',
    value: 'AQ',
    type: 'country',
  },
  {
    label: 'Antigua and Barbuda',
    value: 'AG',
    type: 'country',
  },
  {
    label: 'Argentina',
    value: 'AR',
    type: 'country',
  },
  {
    label: 'Armenia',
    value: 'AM',
    type: 'country',
  },
  {
    label: 'Aruba',
    value: 'AW',
    type: 'country',
  },
  {
    label: 'Australia',
    value: 'AU',
    type: 'country',
  },
  {
    label: 'Austria',
    value: 'AT',
    type: 'country',
  },
  {
    label: 'Azerbaijan',
    value: 'AZ',
    type: 'country',
  },
  {
    label: 'Bahamas',
    value: 'BS',
    type: 'country',
  },
  {
    label: 'Bahrain',
    value: 'BH',
    type: 'country',
  },
  {
    label: 'Bangladesh',
    value: 'BD',
    type: 'country',
  },
  {
    label: 'Barbados',
    value: 'BB',
    type: 'country',
  },
  {
    label: 'Belarus',
    value: 'BY',
    type: 'country',
  },
  {
    label: 'Belgium',
    value: 'BE',
    type: 'country',
  },
  {
    label: 'Belize',
    value: 'BZ',
    type: 'country',
  },
  {
    label: 'Benin',
    value: 'BJ',
    type: 'country',
  },
  {
    label: 'Bermuda',
    value: 'BM',
    type: 'country',
  },
  {
    label: 'Bhutan',
    value: 'BT',
    type: 'country',
  },
  {
    label: 'Bolivia, Plurinational State of',
    value: 'BO',
    type: 'country',
  },
  {
    label: 'Bonaire, Sint Eustatius and Saba',
    value: 'BQ',
    type: 'country',
  },
  {
    label: 'Bosnia and Herzegovina',
    value: 'BA',
    type: 'country',
  },
  {
    label: 'Botswana',
    value: 'BW',
    type: 'country',
  },
  {
    label: 'Bouvet Island',
    value: 'BV',
    type: 'country',
  },
  {
    label: 'Brazil',
    value: 'BR',
    type: 'country',
  },
  {
    label: 'British Indian Ocean Territory',
    value: 'IO',
    type: 'country',
  },
  {
    label: 'Brunei Darussalam',
    value: 'BN',
    type: 'country',
  },
  {
    label: 'Bulgaria',
    value: 'BG',
    type: 'country',
  },
  {
    label: 'Burkina Faso',
    value: 'BF',
    type: 'country',
  },
  {
    label: 'Burundi',
    value: 'BI',
    type: 'country',
  },
  {
    label: 'Cambodia',
    value: 'KH',
    type: 'country',
  },
  {
    label: 'Cameroon',
    value: 'CM',
    type: 'country',
  },
  {
    label: 'Canada',
    value: 'CA',
    type: 'country',
  },
  {
    label: 'Cape Verde',
    value: 'CV',
    type: 'country',
  },
  {
    label: 'Cayman Islands',
    value: 'KY',
    type: 'country',
  },
  {
    label: 'Central African Republic',
    value: 'CF',
    type: 'country',
  },
  {
    label: 'Chad',
    value: 'TD',
    type: 'country',
  },
  {
    label: 'Chile',
    value: 'CL',
    type: 'country',
  },
  {
    label: 'China',
    value: 'CN',
    type: 'country',
  },
  {
    label: 'Christmas Island',
    value: 'CX',
    type: 'country',
  },
  {
    label: 'Cocos (Keeling) Islands',
    value: 'CC',
    type: 'country',
  },
  {
    label: 'Colombia',
    value: 'CO',
    type: 'country',
  },
  {
    label: 'Comoros',
    value: 'KM',
    type: 'country',
  },
  {
    label: 'Congo',
    value: 'CG',
    type: 'country',
  },
  {
    label: 'Congo, the Democratic Republic of the',
    value: 'CD',
    type: 'country',
  },
  {
    label: 'Cook Islands',
    value: 'CK',
    type: 'country',
  },
  {
    label: 'Costa Rica',
    value: 'CR',
    type: 'country',
  },
  {
    label: "Côte d'Ivoire",
    value: 'CI',
    type: 'country',
  },
  {
    label: 'Croatia',
    value: 'HR',
    type: 'country',
  },
  {
    label: 'Cuba',
    value: 'CU',
    type: 'country',
  },
  {
    label: 'Curaçao',
    value: 'CW',
    type: 'country',
  },
  {
    label: 'Cyprus',
    value: 'CY',
    type: 'country',
  },
  {
    label: 'Czech Republic',
    value: 'CZ',
    type: 'country',
  },
  {
    label: 'Denmark',
    value: 'DK',
    type: 'country',
  },
  {
    label: 'Djibouti',
    value: 'DJ',
    type: 'country',
  },
  {
    label: 'Dominica',
    value: 'DM',
    type: 'country',
  },
  {
    label: 'Dominican Republic',
    value: 'DO',
    type: 'country',
  },
  {
    label: 'Ecuador',
    value: 'EC',
    type: 'country',
  },
  {
    label: 'Egypt',
    value: 'EG',
    type: 'country',
  },
  {
    label: 'El Salvador',
    value: 'SV',
    type: 'country',
  },
  {
    label: 'Equatorial Guinea',
    value: 'GQ',
    type: 'country',
  },
  {
    label: 'Eritrea',
    value: 'ER',
    type: 'country',
  },
  {
    label: 'Estonia',
    value: 'EE',
    type: 'country',
  },
  {
    label: 'Ethiopia',
    value: 'ET',
    type: 'country',
  },
  {
    label: 'Falkland Islands (Malvinas)',
    value: 'FK',
    type: 'country',
  },
  {
    label: 'Faroe Islands',
    value: 'FO',
    type: 'country',
  },
  {
    label: 'Fiji',
    value: 'FJ',
    type: 'country',
  },
  {
    label: 'Finland',
    value: 'FI',
    type: 'country',
  },
  {
    label: 'France',
    value: 'FR',
    type: 'country',
  },
  {
    label: 'French Guiana',
    value: 'GF',
    type: 'country',
  },
  {
    label: 'French Polynesia',
    value: 'PF',
    type: 'country',
  },
  {
    label: 'French Southern Territories',
    value: 'TF',
    type: 'country',
  },
  {
    label: 'Gabon',
    value: 'GA',
    type: 'country',
  },
  {
    label: 'Gambia',
    value: 'GM',
    type: 'country',
  },
  {
    label: 'Georgia',
    value: 'GE',
    type: 'country',
  },
  {
    label: 'Germany',
    value: 'DE',
    type: 'country',
  },
  {
    label: 'Ghana',
    value: 'GH',
    type: 'country',
  },
  {
    label: 'Gibraltar',
    value: 'GI',
    type: 'country',
  },
  {
    label: 'Greece',
    value: 'GR',
    type: 'country',
  },
  {
    label: 'Greenland',
    value: 'GL',
    type: 'country',
  },
  {
    label: 'Grenada',
    value: 'GD',
    type: 'country',
  },
  {
    label: 'Guadeloupe',
    value: 'GP',
    type: 'country',
  },
  {
    label: 'Guam',
    value: 'GU',
    type: 'country',
  },
  {
    label: 'Guatemala',
    value: 'GT',
    type: 'country',
  },
  {
    label: 'Guernsey',
    value: 'GG',
    type: 'country',
  },
  {
    label: 'Guinea',
    value: 'GN',
    type: 'country',
  },
  {
    label: 'Guinea-Bissau',
    value: 'GW',
    type: 'country',
  },
  {
    label: 'Guyana',
    value: 'GY',
    type: 'country',
  },
  {
    label: 'Haiti',
    value: 'HT',
    type: 'country',
  },
  {
    label: 'Heard Island and McDonald Islands',
    value: 'HM',
    type: 'country',
  },
  {
    label: 'Holy See (Vatican City State)',
    value: 'VA',
    type: 'country',
  },
  {
    label: 'Honduras',
    value: 'HN',
    type: 'country',
  },
  {
    label: 'Hong Kong',
    value: 'HK',
    type: 'country',
  },
  {
    label: 'Hungary',
    value: 'HU',
    type: 'country',
  },
  {
    label: 'Iceland',
    value: 'IS',
    type: 'country',
  },
  {
    label: 'India',
    value: 'IN',
    type: 'country',
  },
  {
    label: 'Indonesia',
    value: 'ID',
    type: 'country',
  },
  {
    label: 'Iran, Islamic Republic of',
    value: 'IR',
    type: 'country',
  },
  {
    label: 'Iraq',
    value: 'IQ',
    type: 'country',
  },
  {
    label: 'Ireland',
    value: 'IE',
    type: 'country',
  },
  {
    label: 'Isle of Man',
    value: 'IM',
    type: 'country',
  },
  {
    label: 'Israel',
    value: 'IL',
    type: 'country',
  },
  {
    label: 'Italy',
    value: 'IT',
    type: 'country',
  },
  {
    label: 'Jamaica',
    value: 'JM',
    type: 'country',
  },
  {
    label: 'Japan',
    value: 'JP',
    type: 'country',
  },
  {
    label: 'Jersey',
    value: 'JE',
    type: 'country',
  },
  {
    label: 'Jordan',
    value: 'JO',
    type: 'country',
  },
  {
    label: 'Kazakhstan',
    value: 'KZ',
    type: 'country',
  },
  {
    label: 'Kenya',
    value: 'KE',
    type: 'country',
  },
  {
    label: 'Kiribati',
    value: 'KI',
    type: 'country',
  },
  {
    label: "Korea, Democratic People's Republic of",
    value: 'KP',
    type: 'country',
  },
  {
    label: 'Korea, Republic of',
    value: 'KR',
    type: 'country',
  },
  {
    label: 'Kuwait',
    value: 'KW',
    type: 'country',
  },
  {
    label: 'Kyrgyzstan',
    value: 'KG',
    type: 'country',
  },
  {
    label: "Lao People's Democratic Republic",
    value: 'LA',
    type: 'country',
  },
  {
    label: 'Latvia',
    value: 'LV',
    type: 'country',
  },
  {
    label: 'Lebanon',
    value: 'LB',
    type: 'country',
  },
  {
    label: 'Lesotho',
    value: 'LS',
    type: 'country',
  },
  {
    label: 'Liberia',
    value: 'LR',
    type: 'country',
  },
  {
    label: 'Libya',
    value: 'LY',
    type: 'country',
  },
  {
    label: 'Liechtenstein',
    value: 'LI',
    type: 'country',
  },
  {
    label: 'Lithuania',
    value: 'LT',
    type: 'country',
  },
  {
    label: 'Luxembourg',
    value: 'LU',
    type: 'country',
  },
  {
    label: 'Macao',
    value: 'MO',
    type: 'country',
  },
  {
    label: 'Macedonia, the Former Yugoslav Republic of',
    value: 'MK',
    type: 'country',
  },
  {
    label: 'Madagascar',
    value: 'MG',
    type: 'country',
  },
  {
    label: 'Malawi',
    value: 'MW',
    type: 'country',
  },
  {
    label: 'Malaysia',
    value: 'MY',
    type: 'country',
  },
  {
    label: 'Maldives',
    value: 'MV',
    type: 'country',
  },
  {
    label: 'Mali',
    value: 'ML',
    type: 'country',
  },
  {
    label: 'Malta',
    value: 'MT',
    type: 'country',
  },
  {
    label: 'Marshall Islands',
    value: 'MH',
    type: 'country',
  },
  {
    label: 'Martinique',
    value: 'MQ',
    type: 'country',
  },
  {
    label: 'Mauritania',
    value: 'MR',
    type: 'country',
  },
  {
    label: 'Mauritius',
    value: 'MU',
    type: 'country',
  },
  {
    label: 'Mayotte',
    value: 'YT',
    type: 'country',
  },
  {
    label: 'Mexico',
    value: 'MX',
    type: 'country',
  },
  {
    label: 'Micronesia, Federated States of',
    value: 'FM',
    type: 'country',
  },
  {
    label: 'Moldova, Republic of',
    value: 'MD',
    type: 'country',
  },
  {
    label: 'Monaco',
    value: 'MC',
    type: 'country',
  },
  {
    label: 'Mongolia',
    value: 'MN',
    type: 'country',
  },
  {
    label: 'Montenegro',
    value: 'ME',
    type: 'country',
  },
  {
    label: 'Montserrat',
    value: 'MS',
    type: 'country',
  },
  {
    label: 'Morocco',
    value: 'MA',
    type: 'country',
  },
  {
    label: 'Mozambique',
    value: 'MZ',
    type: 'country',
  },
  {
    label: 'Myanmar',
    value: 'MM',
    type: 'country',
  },
  {
    label: 'Namibia',
    value: 'NA',
    type: 'country',
  },
  {
    label: 'Nauru',
    value: 'NR',
    type: 'country',
  },
  {
    label: 'Nepal',
    value: 'NP',
    type: 'country',
  },
  {
    label: 'Netherlands',
    value: 'NL',
    type: 'country',
  },
  {
    label: 'New Caledonia',
    value: 'NC',
    type: 'country',
  },
  {
    label: 'New Zealand',
    value: 'NZ',
    type: 'country',
  },
  {
    label: 'Nicaragua',
    value: 'NI',
    type: 'country',
  },
  {
    label: 'Niger',
    value: 'NE',
    type: 'country',
  },
  {
    label: 'Nigeria',
    value: 'NG',
    type: 'country',
  },
  {
    label: 'Niue',
    value: 'NU',
    type: 'country',
  },
  {
    label: 'Norfolk Island',
    value: 'NF',
    type: 'country',
  },
  {
    label: 'Northern Mariana Islands',
    value: 'MP',
    type: 'country',
  },
  {
    label: 'Norway',
    value: 'NO',
    type: 'country',
  },
  {
    label: 'Oman',
    value: 'OM',
    type: 'country',
  },
  {
    label: 'Pakistan',
    value: 'PK',
    type: 'country',
  },
  {
    label: 'Palau',
    value: 'PW',
    type: 'country',
  },
  {
    label: 'Palestine, State of',
    value: 'PS',
    type: 'country',
  },
  {
    label: 'Panama',
    value: 'PA',
    type: 'country',
  },
  {
    label: 'Papua New Guinea',
    value: 'PG',
    type: 'country',
  },
  {
    label: 'Paraguay',
    value: 'PY',
    type: 'country',
  },
  {
    label: 'Peru',
    value: 'PE',
    type: 'country',
  },
  {
    label: 'Philippines',
    value: 'PH',
    type: 'country',
  },
  {
    label: 'Pitcairn',
    value: 'PN',
    type: 'country',
  },
  {
    label: 'Poland',
    value: 'PL',
    type: 'country',
  },
  {
    label: 'Portugal',
    value: 'PT',
    type: 'country',
  },
  {
    label: 'Puerto Rico',
    value: 'PR',
    type: 'country',
  },
  {
    label: 'Qatar',
    value: 'QA',
    type: 'country',
  },
  {
    label: 'Réunion',
    value: 'RE',
    type: 'country',
  },
  {
    label: 'Romania',
    value: 'RO',
    type: 'country',
  },
  {
    label: 'Russian Federation',
    value: 'RU',
    type: 'country',
  },
  {
    label: 'Rwanda',
    value: 'RW',
    type: 'country',
  },
  {
    label: 'Saint Barthélemy',
    value: 'BL',
    type: 'country',
  },
  {
    label: 'Saint Helena, Ascension and Tristan da Cunha',
    value: 'SH',
    type: 'country',
  },
  {
    label: 'Saint Kitts and Nevis',
    value: 'KN',
    type: 'country',
  },
  {
    label: 'Saint Lucia',
    value: 'LC',
    type: 'country',
  },
  {
    label: 'Saint Martin (French part)',
    value: 'MF',
    type: 'country',
  },
  {
    label: 'Saint Pierre and Miquelon',
    value: 'PM',
    type: 'country',
  },
  {
    label: 'Saint Vincent and the Grenadines',
    value: 'VC',
    type: 'country',
  },
  {
    label: 'Samoa',
    value: 'WS',
    type: 'country',
  },
  {
    label: 'San Marino',
    value: 'SM',
    type: 'country',
  },
  {
    label: 'Sao Tome and Principe',
    value: 'ST',
    type: 'country',
  },
  {
    label: 'Saudi Arabia',
    value: 'SA',
    type: 'country',
  },
  {
    label: 'Senegal',
    value: 'SN',
    type: 'country',
  },
  {
    label: 'Serbia',
    value: 'RS',
    type: 'country',
  },
  {
    label: 'Seychelles',
    value: 'SC',
    type: 'country',
  },
  {
    label: 'Sierra Leone',
    value: 'SL',
    type: 'country',
  },
  {
    label: 'Singapore',
    value: 'SG',
    type: 'country',
  },
  {
    label: 'Sint Maarten (Dutch part)',
    value: 'SX',
    type: 'country',
  },
  {
    label: 'Slovakia',
    value: 'SK',
    type: 'country',
  },
  {
    label: 'Slovenia',
    value: 'SI',
    type: 'country',
  },
  {
    label: 'Solomon Islands',
    value: 'SB',
    type: 'country',
  },
  {
    label: 'Somalia',
    value: 'SO',
    type: 'country',
  },
  {
    label: 'South Africa',
    value: 'ZA',
    type: 'country',
  },
  {
    label: 'South Georgia and the South Sandwich Islands',
    value: 'GS',
    type: 'country',
  },
  {
    label: 'South Sudan',
    value: 'SS',
    type: 'country',
  },
  {
    label: 'Spain',
    value: 'ES',
    type: 'country',
  },
  {
    label: 'Sri Lanka',
    value: 'LK',
    type: 'country',
  },
  {
    label: 'Sudan',
    value: 'SD',
    type: 'country',
  },
  {
    label: 'Suriname',
    value: 'SR',
    type: 'country',
  },
  {
    label: 'Svalbard and Jan Mayen',
    value: 'SJ',
    type: 'country',
  },
  {
    label: 'Swaziland',
    value: 'SZ',
    type: 'country',
  },
  {
    label: 'Sweden',
    value: 'SE',
    type: 'country',
  },
  {
    label: 'Switzerland',
    value: 'CH',
    type: 'country',
  },
  {
    label: 'Syrian Arab Republic',
    value: 'SY',
    type: 'country',
  },
  {
    label: 'Taiwan, Province of China',
    value: 'TW',
    type: 'country',
  },
  {
    label: 'Tajikistan',
    value: 'TJ',
    type: 'country',
  },
  {
    label: 'Tanzania, United Republic of',
    value: 'TZ',
    type: 'country',
  },
  {
    label: 'Thailand',
    value: 'TH',
    type: 'country',
  },
  {
    label: 'Timor-Leste',
    value: 'TL',
    type: 'country',
  },
  {
    label: 'Togo',
    value: 'TG',
    type: 'country',
  },
  {
    label: 'Tokelau',
    value: 'TK',
    type: 'country',
  },
  {
    label: 'Tonga',
    value: 'TO',
    type: 'country',
  },
  {
    label: 'Trinidad and Tobago',
    value: 'TT',
    type: 'country',
  },
  {
    label: 'Tunisia',
    value: 'TN',
    type: 'country',
  },
  {
    label: 'Turkey',
    value: 'TR',
    type: 'country',
  },
  {
    label: 'Turkmenistan',
    value: 'TM',
    type: 'country',
  },
  {
    label: 'Turks and Caicos Islands',
    value: 'TC',
    type: 'country',
  },
  {
    label: 'Tuvalu',
    value: 'TV',
    type: 'country',
  },
  {
    label: 'Uganda',
    value: 'UG',
    type: 'country',
  },
  {
    label: 'Ukraine',
    value: 'UA',
    type: 'country',
  },
  {
    label: 'United Arab Emirates',
    value: 'AE',
    type: 'country',
  },
  {
    label: 'United Kingdom',
    value: 'GB',
    type: 'country',
  },
  {
    label: 'United States',
    value: 'US',
    type: 'country',
  },
  {
    label: 'United States Minor Outlying Islands',
    value: 'UM',
    type: 'country',
  },
  {
    label: 'Uruguay',
    value: 'UY',
    type: 'country',
  },
  {
    label: 'Uzbekistan',
    value: 'UZ',
    type: 'country',
  },
  {
    label: 'Vanuatu',
    value: 'VU',
    type: 'country',
  },
  {
    label: 'Venezuela, Bolivarian Republic of',
    value: 'VE',
    type: 'country',
  },
  {
    label: 'Viet Nam',
    value: 'VN',
    type: 'country',
  },
  {
    label: 'Virgin Islands, British',
    value: 'VG',
    type: 'country',
  },
  {
    label: 'Virgin Islands, U.S.',
    value: 'VI',
    type: 'country',
  },
  {
    label: 'Wallis and Futuna',
    value: 'WF',
    type: 'country',
  },
  {
    label: 'Western Sahara',
    value: 'EH',
    type: 'country',
  },
  {
    label: 'Yemen',
    value: 'YE',
    type: 'country',
  },
  {
    label: 'Zambia',
    value: 'ZM',
    type: 'country',
  },
  {
    label: 'Zimbabwe',
    value: 'ZW',
    type: 'country',
  },
];

const tableData: DashboardTableItem[] = [
  {
    location: 'United Kingdom',
    locationId: 'GB',
    type: 'country',
    signedInitiative: true,
    score: 0.6,
    ecosystems: ['Mangroves', 'Open ocean', 'Kelp forest'],
    updated: new Date('2023-08-01'),
  },
  {
    location: 'Mexico',
    locationId: 'MX',
    type: 'country',
    signedInitiative: false,
    score: undefined,
    ecosystems: [],
    updated: new Date('2023-07-01'),
  },
  {
    location: 'Spain',
    locationId: 'ES',
    type: 'country',
    signedInitiative: true,
    score: 3.0,
    ecosystems: ['Open ocean'],
    updated: new Date('2022-10-01'),
  },
  {
    location: 'Brazil',
    locationId: 'BR',
    type: 'country',
    signedInitiative: false,
    score: undefined,
    ecosystems: [],
    updated: new Date('2023-01-01'),
  },
  {
    location: 'France',
    locationId: 'FR',
    type: 'country',
    signedInitiative: true,
    score: 12.7,
    ecosystems: ['Mangroves'],
    updated: new Date('2021-12-01'),
  },
  {
    location: 'Netherlands',
    locationId: 'NL',
    type: 'country',
    signedInitiative: true,
    score: 1.6,
    ecosystems: ['Kelp forest', 'Open ocean'],
    updated: new Date('2022-02-01'),
  },
  {
    location: 'Worldwide',
    locationId: 'worldwide',
    type: 'region',
    signedInitiative: true,
    score: 1.6,
    ecosystems: ['Coral reefs', 'Kelp forest', 'Open ocean'],
    updated: new Date('2023-04-01'),
  },
];

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: locations.map(({ value }) => ({ params: { locationId: value } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<{ locationId: string }> = ({
  params: { locationId },
}) => {
  return {
    props: {
      locationId: locationId as string,
    },
  };
};

const DashboardPage: React.FC<InferGetStaticPropsType<typeof getStaticProps>> = ({
  locationId,
}) => {
  const router = useRouter();

  const [locationPopoverOpen, setLocationPopoverOpen] = useState(false);

  const locationName = useMemo(
    () => locations.find(({ value }) => value === locationId).label,
    [locationId]
  );

  return (
    <DefaultLayout title={`${locationName} Dashboard`}>
      <div className="mt-6">
        {locationId !== 'worldwide' && (
          <Link
            href="/dashboard/worldwide"
            className="mb-3 block w-fit bg-black p-2 text-xs font-bold text-white underline ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          >
            Worldwide
          </Link>
        )}
        <Popover open={locationPopoverOpen} onOpenChange={setLocationPopoverOpen}>
          <PopoverTrigger className="ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2">
            <h1
              className={cn('flex items-center text-left text-4xl font-black uppercase', {
                'md:text-6xl': locationId === 'worldwide',
              })}
            >
              {locationName}
              <ChevronDown className="ml-2 h-10 w-10" />
            </h1>
          </PopoverTrigger>
          <PopoverContent className="w-96 max-w-screen" align="start">
            <Command label="Search country or region">
              <CommandInput placeholder="Search country or region" />
              <CommandEmpty>No result</CommandEmpty>
              <CommandGroup className="mt-4 max-h-64 overflow-y-scroll">
                {locations.map(({ label, value, type }) => (
                  <CommandItem
                    key={value}
                    value={label}
                    onSelect={() => {
                      void router.replace(`/dashboard/${value}`);
                      setLocationPopoverOpen(false);
                    }}
                  >
                    <div className="flex w-full justify-between gap-x-4">
                      <div className="flex font-bold underline">
                        <Check
                          className={cn(
                            'relative top-1 mr-2 inline-block h-4 w-4 flex-shrink-0',
                            locationId === value ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        {label}
                      </div>
                      <span className="flex-shrink-0 capitalize text-gray-400">{type}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        <p className="mt-3 text-xs text-gray-500">Status last updated: August 2023</p>
        {locationId === 'worldwide' && (
          <div className="mt-8">
            <DashboardTable data={tableData} />
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default DashboardPage;
