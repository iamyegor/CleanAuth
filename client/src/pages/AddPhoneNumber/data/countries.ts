import Country from "@/pages/AddPhoneNumber/types/Country.ts";

const countries: Country[] = [
    { id: 1, flag: "🇷🇺", name: "Russia", code: "RU", dialCode: "+7", maxDigits: 10 },
    { id: 2, flag: "🇺🇸", name: "United States", code: "US", dialCode: "+1", maxDigits: 10 },
    { id: 3, flag: "🇨🇭", name: "Switzerland", code: "CH", dialCode: "+41", maxDigits: 9 },

    { id: 4, flag: "🇦🇫", name: "Afghanistan", code: "AF", dialCode: "+93" },
    { id: 5, flag: "🇦🇽", name: "Åland Islands", code: "AX", dialCode: "+358" },
    { id: 6, flag: "🇦🇱", name: "Albania", code: "AL", dialCode: "+355" },
    { id: 7, flag: "🇩🇿", name: "Algeria", code: "DZ", dialCode: "+213" },
    { id: 8, flag: "🇦🇸", name: "American Samoa", code: "AS", dialCode: "+1" },
    { id: 9, flag: "🇦🇩", name: "Andorra", code: "AD", dialCode: "+376" },
    { id: 10, flag: "🇦🇴", name: "Angola", code: "AO", dialCode: "+244" },
    { id: 11, flag: "🇦🇮", name: "Anguilla", code: "AI", dialCode: "+1" },
    { id: 12, flag: "🇦🇶", name: "Antarctica", code: "AQ", dialCode: "+672" },
    { id: 13, flag: "🇦🇬", name: "Antigua and Barbuda", code: "AG", dialCode: "+1" },
    { id: 14, flag: "🇦🇷", name: "Argentina", code: "AR", dialCode: "+54" },
    { id: 15, flag: "🇦🇲", name: "Armenia", code: "AM", dialCode: "+374" },
    { id: 16, flag: "🇦🇼", name: "Aruba", code: "AW", dialCode: "+297" },
    { id: 17, flag: "🇦🇨", name: "Ascension Island", code: "AC", dialCode: "+247" },
    { id: 18, flag: "🇦🇺", name: "Australia", code: "AU", dialCode: "+61", maxDigits: 9 },
    { id: 19, flag: "🇦🇹", name: "Austria", code: "AT", dialCode: "+43" },
    { id: 20, flag: "🇦🇿", name: "Azerbaijan", code: "AZ", dialCode: "+994" },
    { id: 21, flag: "🇧🇸", name: "Bahamas", code: "BS", dialCode: "+1" },
    { id: 22, flag: "🇧🇭", name: "Bahrain", code: "BH", dialCode: "+973" },
    { id: 23, flag: "🇧🇩", name: "Bangladesh", code: "BD", dialCode: "+880" },
    { id: 24, flag: "🇧🇧", name: "Barbados", code: "BB", dialCode: "+1" },
    { id: 25, flag: "🇧🇾", name: "Belarus", code: "BY", dialCode: "+375" },
    { id: 26, flag: "🇧🇪", name: "Belgium", code: "BE", dialCode: "+32" },
    { id: 27, flag: "🇧🇿", name: "Belize", code: "BZ", dialCode: "+501" },
    { id: 28, flag: "🇧🇯", name: "Benin", code: "BJ", dialCode: "+229" },
    { id: 29, flag: "🇧🇲", name: "Bermuda", code: "BM", dialCode: "+1" },
    { id: 30, flag: "🇧🇹", name: "Bhutan", code: "BT", dialCode: "+975" },
    { id: 31, flag: "🇧🇴", name: "Bolivia", code: "BO", dialCode: "+591" },
    { id: 32, flag: "🇧🇶", name: "Bonaire", code: "BQ", dialCode: "+599" },
    { id: 33, flag: "🇧🇦", name: "Bosnia and Herzegovina", code: "BA", dialCode: "+387" },
    { id: 34, flag: "🇧🇼", name: "Botswana", code: "BW", dialCode: "+267" },
    { id: 35, flag: "🇧🇻", name: "Bouvet Island", code: "BV", dialCode: "+47" },
    { id: 36, flag: "🇧🇷", name: "Brazil", code: "BR", dialCode: "+55", maxDigits: 11 },
    { id: 37, flag: "🇮🇴", name: "British Indian Ocean Territory", code: "IO", dialCode: "+246" },
    { id: 38, flag: "🇻🇬", name: "British Virgin Islands", code: "VG", dialCode: "+1" },
    { id: 39, flag: "🇧🇳", name: "Brunei", code: "BN", dialCode: "+673" },
    { id: 40, flag: "🇧🇬", name: "Bulgaria", code: "BG", dialCode: "+359" },
    { id: 41, flag: "🇧🇫", name: "Burkina Faso", code: "BF", dialCode: "+226" },
    { id: 42, flag: "🇧🇮", name: "Burundi", code: "BI", dialCode: "+257" },
    { id: 43, flag: "🇨🇻", name: "Cabo Verde", code: "CV", dialCode: "+238" },
    { id: 44, flag: "🇰🇭", name: "Cambodia", code: "KH", dialCode: "+855" },
    { id: 45, flag: "🇨🇲", name: "Cameroon", code: "CM", dialCode: "+237" },
    { id: 46, flag: "🇨🇦", name: "Canada", code: "CA", dialCode: "+1", maxDigits: 10 },
    { id: 47, flag: "🇮🇨", name: "Canary Islands", code: "IC", dialCode: "+34" },
    { id: 48, flag: "🇰🇾", name: "Cayman Islands", code: "KY", dialCode: "+1" },
    { id: 49, flag: "🇨🇫", name: "Central African Republic", code: "CF", dialCode: "+236" },
    { id: 50, flag: "🇪🇭", name: "Western Sahara", code: "EH", dialCode: "+212" },
    { id: 51, flag: "🇹🇩", name: "Chad", code: "TD", dialCode: "+235" },
    { id: 52, flag: "🇨🇱", name: "Chile", code: "CL", dialCode: "+56" },
    { id: 53, flag: "🇨🇽", name: "Christmas Island", code: "CX", dialCode: "+61" },
    { id: 54, flag: "🇨🇨", name: "Cocos (Keeling) Islands", code: "CC", dialCode: "+61" },
    { id: 55, flag: "🇨🇴", name: "Colombia", code: "CO", dialCode: "+57" },
    { id: 56, flag: "🇰🇲", name: "Comoros", code: "KM", dialCode: "+269" },
    { id: 57, flag: "🇨🇩", name: "Congo (DRC)", code: "CD", dialCode: "+243" },
    { id: 58, flag: "🇨🇬", name: "Congo (Republic)", code: "CG", dialCode: "+242" },
    { id: 59, flag: "🇨🇰", name: "Cook Islands", code: "CK", dialCode: "+682" },
    { id: 60, flag: "🇨🇷", name: "Costa Rica", code: "CR", dialCode: "+506" },
    { id: 61, flag: "🇨🇮", name: "Côte d'Ivoire", code: "CI", dialCode: "+225" },
    { id: 62, flag: "🇭🇷", name: "Croatia", code: "HR", dialCode: "+385" },
    { id: 63, flag: "🇨🇺", name: "Cuba", code: "CU", dialCode: "+53" },
    { id: 64, flag: "🇨🇼", name: "Curaçao", code: "CW", dialCode: "+599" },
    { id: 65, flag: "🇨🇾", name: "Cyprus", code: "CY", dialCode: "+357" },
    { id: 66, flag: "🇨🇿", name: "Czechia", code: "CZ", dialCode: "+420" },
    { id: 67, flag: "🇩🇰", name: "Denmark", code: "DK", dialCode: "+45" },
    { id: 68, flag: "🇩🇯", name: "Djibouti", code: "DJ", dialCode: "+253" },
    { id: 69, flag: "🇩🇲", name: "Dominica", code: "DM", dialCode: "+1" },
    { id: 70, flag: "🇩🇴", name: "Dominican Republic", code: "DO", dialCode: "+1" },
    { id: 71, flag: "🇪🇨", name: "Ecuador", code: "EC", dialCode: "+593" },
    { id: 72, flag: "🇪🇬", name: "Egypt", code: "EG", dialCode: "+20" },
    { id: 73, flag: "🇸🇻", name: "El Salvador", code: "SV", dialCode: "+503" },
    { id: 74, flag: "🇬🇶", name: "Equatorial Guinea", code: "GQ", dialCode: "+240" },
    { id: 75, flag: "🇪🇷", name: "Eritrea", code: "ER", dialCode: "+291" },
    { id: 76, flag: "🇪🇪", name: "Estonia", code: "EE", dialCode: "+372" },
    { id: 77, flag: "🇪🇹", name: "Ethiopia", code: "ET", dialCode: "+251" },
    { id: 78, flag: "🇫🇰", name: "Falkland Islands", code: "FK", dialCode: "+500" },
    { id: 79, flag: "🇫🇴", name: "Faroe Islands", code: "FO", dialCode: "+298" },
    { id: 80, flag: "🇫🇯", name: "Fiji", code: "FJ", dialCode: "+679" },
    { id: 81, flag: "🇫🇮", name: "Finland", code: "FI", dialCode: "+358" },
    { id: 82, flag: "🇫🇷", name: "France", code: "FR", dialCode: "+33", maxDigits: 9 },
    { id: 83, flag: "🇬🇫", name: "French Guiana", code: "GF", dialCode: "+594" },
    { id: 84, flag: "🇵🇫", name: "French Polynesia", code: "PF", dialCode: "+689" },
    { id: 85, flag: "🇹🇫", name: "French Southern Territories", code: "TF", dialCode: "+262" },
    { id: 86, flag: "🇬🇦", name: "Gabon", code: "GA", dialCode: "+241" },
    { id: 87, flag: "🇬🇲", name: "Gambia", code: "GM", dialCode: "+220" },
    { id: 88, flag: "🇬🇪", name: "Georgia", code: "GE", dialCode: "+995" },
    { id: 89, flag: "🇩🇪", name: "Germany", code: "DE", dialCode: "+49", maxDigits: 10 },
    { id: 90, flag: "🇬🇭", name: "Ghana", code: "GH", dialCode: "+233" },
    { id: 91, flag: "🇬🇮", name: "Gibraltar", code: "GI", dialCode: "+350" },
    { id: 92, flag: "🇬🇷", name: "Greece", code: "GR", dialCode: "+30" },
    { id: 93, flag: "🇬🇱", name: "Greenland", code: "GL", dialCode: "+299" },
    { id: 94, flag: "🇬🇩", name: "Grenada", code: "GD", dialCode: "+1" },
    { id: 95, flag: "🇬🇵", name: "Guadeloupe", code: "GP", dialCode: "+590" },
    { id: 96, flag: "🇬🇺", name: "Guam", code: "GU", dialCode: "+1" },
    { id: 97, flag: "🇬🇹", name: "Guatemala", code: "GT", dialCode: "+502" },
    { id: 98, flag: "🇬🇬", name: "Guernsey", code: "GG", dialCode: "+44" },
    { id: 99, flag: "🇬🇳", name: "Guinea", code: "GN", dialCode: "+224" },
    { id: 100, flag: "🇬🇼", name: "Guinea-Bissau", code: "GW", dialCode: "+245" },
    { id: 101, flag: "🇬🇾", name: "Guyana", code: "GY", dialCode: "+592" },
    { id: 102, flag: "🇭🇹", name: "Haiti", code: "HT", dialCode: "+509" },
    { id: 103, flag: "🇭🇲", name: "Heard & McDonald Islands", code: "HM", dialCode: "+672" },
    { id: 104, flag: "🇭🇳", name: "Honduras", code: "HN", dialCode: "+504" },
    { id: 105, flag: "🇭🇰", name: "Hong Kong", code: "HK", dialCode: "+852" },
    { id: 106, flag: "🇭🇺", name: "Hungary", code: "HU", dialCode: "+36" },
    { id: 107, flag: "🇮🇸", name: "Iceland", code: "IS", dialCode: "+354" },
    { id: 108, flag: "🇮🇳", name: "India", code: "IN", dialCode: "+91", maxDigits: 10 },
    { id: 109, flag: "🇮🇩", name: "Indonesia", code: "ID", dialCode: "+62", maxDigits: 10 },
    { id: 110, flag: "🇮🇷", name: "Iran", code: "IR", dialCode: "+98" },
    { id: 111, flag: "🇮🇶", name: "Iraq", code: "IQ", dialCode: "+964" },
    { id: 112, flag: "🇮🇪", name: "Ireland", code: "IE", dialCode: "+353" },
    { id: 113, flag: "🇮🇲", name: "Isle of Man", code: "IM", dialCode: "+44" },
    { id: 114, flag: "🇮🇱", name: "Israel", code: "IL", dialCode: "+972" },
    { id: 115, flag: "🇮🇹", name: "Italy", code: "IT", dialCode: "+39", maxDigits: 11 },
    { id: 116, flag: "🇯🇲", name: "Jamaica", code: "JM", dialCode: "+1" },
    { id: 117, flag: "🇯🇵", name: "Japan", code: "JP", dialCode: "+81", maxDigits: 9 },
    { id: 118, flag: "🇯🇪", name: "Jersey", code: "JE", dialCode: "+44" },
    { id: 119, flag: "🇯🇴", name: "Jordan", code: "JO", dialCode: "+962" },
    { id: 120, flag: "🇰🇿", name: "Kazakhstan", code: "KZ", dialCode: "+7" },
    { id: 121, flag: "🇰🇪", name: "Kenya", code: "KE", dialCode: "+254" },
    { id: 122, flag: "🇰🇮", name: "Kiribati", code: "KI", dialCode: "+686" },
    { id: 123, flag: "🇽🇰", name: "Kosovo", code: "XK", dialCode: "+383" },
    { id: 124, flag: "🇰🇼", name: "Kuwait", code: "KW", dialCode: "+965" },
    { id: 125, flag: "🇰🇬", name: "Kyrgyzstan", code: "KG", dialCode: "+996" },
    { id: 126, flag: "🇱🇦", name: "Laos", code: "LA", dialCode: "+856" },
    { id: 127, flag: "🇱🇻", name: "Latvia", code: "LV", dialCode: "+371" },
    { id: 128, flag: "🇱🇧", name: "Lebanon", code: "LB", dialCode: "+961" },
    { id: 129, flag: "🇱🇸", name: "Lesotho", code: "LS", dialCode: "+266" },
    { id: 130, flag: "🇱🇷", name: "Liberia", code: "LR", dialCode: "+231" },
    { id: 131, flag: "🇱🇾", name: "Libya", code: "LY", dialCode: "+218" },
    { id: 132, flag: "🇱🇮", name: "Liechtenstein", code: "LI", dialCode: "+423" },
    { id: 133, flag: "🇱🇹", name: "Lithuania", code: "LT", dialCode: "+370" },
    { id: 134, flag: "🇱🇺", name: "Luxembourg", code: "LU", dialCode: "+352" },
    { id: 135, flag: "🇲🇴", name: "Macao", code: "MO", dialCode: "+853" },
    { id: 136, flag: "🇲🇬", name: "Madagascar", code: "MG", dialCode: "+261" },
    { id: 137, flag: "🇲🇼", name: "Malawi", code: "MW", dialCode: "+265" },
    { id: 138, flag: "🇲🇾", name: "Malaysia", code: "MY", dialCode: "+60" },
    { id: 139, flag: "🇲🇻", name: "Maldives", code: "MV", dialCode: "+960" },
    { id: 140, flag: "🇲🇱", name: "Mali", code: "ML", dialCode: "+223" },
    { id: 141, flag: "🇲🇹", name: "Malta", code: "MT", dialCode: "+356" },
    { id: 142, flag: "🇲🇭", name: "Marshall Islands", code: "MH", dialCode: "+692" },
    { id: 143, flag: "🇲🇶", name: "Martinique", code: "MQ", dialCode: "+596" },
    { id: 144, flag: "🇲🇷", name: "Mauritania", code: "MR", dialCode: "+222" },
    { id: 145, flag: "🇲🇺", name: "Mauritius", code: "MU", dialCode: "+230" },
    { id: 146, flag: "🇾🇹", name: "Mayotte", code: "YT", dialCode: "+262" },
    { id: 147, flag: "🇲🇽", name: "Mexico", code: "MX", dialCode: "+52", maxDigits: 10 },
    { id: 148, flag: "🇫🇲", name: "Micronesia", code: "FM", dialCode: "+691" },
    { id: 149, flag: "🇲🇩", name: "Moldova", code: "MD", dialCode: "+373" },
    { id: 150, flag: "🇲🇨", name: "Monaco", code: "MC", dialCode: "+377" },
    { id: 151, flag: "🇲🇳", name: "Mongolia", code: "MN", dialCode: "+976" },
    { id: 152, flag: "🇲🇪", name: "Montenegro", code: "ME", dialCode: "+382" },
    { id: 153, flag: "🇲🇸", name: "Montserrat", code: "MS", dialCode: "+1" },
    { id: 154, flag: "🇲🇦", name: "Morocco", code: "MA", dialCode: "+212" },
    { id: 155, flag: "🇲🇿", name: "Mozambique", code: "MZ", dialCode: "+258" },
    { id: 156, flag: "🇲🇲", name: "Myanmar (Burma)", code: "MM", dialCode: "+95" },
    { id: 157, flag: "🇳🇦", name: "Namibia", code: "NA", dialCode: "+264" },
    { id: 158, flag: "🇳🇷", name: "Nauru", code: "NR", dialCode: "+674" },
    { id: 159, flag: "🇳🇵", name: "Nepal", code: "NP", dialCode: "+977" },
    { id: 160, flag: "🇳🇱", name: "Netherlands", code: "NL", dialCode: "+31", maxDigits: 9 },
    { id: 161, flag: "🇳🇨", name: "New Caledonia", code: "NC", dialCode: "+687" },
    { id: 162, flag: "🇳🇿", name: "New Zealand", code: "NZ", dialCode: "+64" },
    { id: 163, flag: "🇳🇮", name: "Nicaragua", code: "NI", dialCode: "+505" },
    { id: 164, flag: "🇳🇪", name: "Niger", code: "NE", dialCode: "+227" },
    { id: 165, flag: "🇳🇬", name: "Nigeria", code: "NG", dialCode: "+234" },
    { id: 166, flag: "🇳🇺", name: "Niue", code: "NU", dialCode: "+683" },
    { id: 167, flag: "🇳🇫", name: "Norfolk Island", code: "NF", dialCode: "+672" },
    { id: 168, flag: "🇰🇵", name: "North Korea", code: "KP", dialCode: "+850" },
    { id: 169, flag: "🇲🇰", name: "North Macedonia", code: "MK", dialCode: "+389" },
    { id: 170, flag: "🇲🇵", name: "Northern Mariana Islands", code: "MP", dialCode: "+1" },
    { id: 171, flag: "🇳🇴", name: "Norway", code: "NO", dialCode: "+47" },
    { id: 172, flag: "🇴🇲", name: "Oman", code: "OM", dialCode: "+968" },
    { id: 173, flag: "🇵🇰", name: "Pakistan", code: "PK", dialCode: "+92" },
    { id: 174, flag: "🇵🇼", name: "Palau", code: "PW", dialCode: "+680" },
    { id: 175, flag: "🇵🇸", name: "Palestine", code: "PS", dialCode: "+970" },
    { id: 176, flag: "🇵🇦", name: "Panama", code: "PA", dialCode: "+507" },
    { id: 177, flag: "🇵🇬", name: "Papua New Guinea", code: "PG", dialCode: "+675" },
    { id: 178, flag: "🇵🇾", name: "Paraguay", code: "PY", dialCode: "+595" },
    { id: 179, flag: "🇵🇪", name: "Peru", code: "PE", dialCode: "+51" },
    { id: 180, flag: "🇵🇭", name: "Philippines", code: "PH", dialCode: "+63" },
    { id: 181, flag: "🇵🇳", name: "Pitcairn Islands", code: "PN", dialCode: "+64" },
    { id: 182, flag: "🇵🇱", name: "Poland", code: "PL", dialCode: "+48" },
    { id: 183, flag: "🇵🇹", name: "Portugal", code: "PT", dialCode: "+351" },
    { id: 184, flag: "🇵🇷", name: "Puerto Rico", code: "PR", dialCode: "+1" },
    { id: 185, flag: "🇶🇦", name: "Qatar", code: "QA", dialCode: "+974" },
    { id: 186, flag: "🇷🇪", name: "Réunion", code: "RE", dialCode: "+262" },
    { id: 187, flag: "🇷🇴", name: "Romania", code: "RO", dialCode: "+40" },
    { id: 188, flag: "🇷🇼", name: "Rwanda", code: "RW", dialCode: "+250" },
    { id: 189, flag: "🇼🇸", name: "Samoa", code: "WS", dialCode: "+685" },
    { id: 190, flag: "🇸🇲", name: "San Marino", code: "SM", dialCode: "+378" },
    { id: 191, flag: "🇸🇹", name: "São Tomé and Príncipe", code: "ST", dialCode: "+239" },
    { id: 192, flag: "🇸🇦", name: "Saudi Arabia", code: "SA", dialCode: "+966", maxDigits: 9 },
    { id: 193, flag: "🇸🇳", name: "Senegal", code: "SN", dialCode: "+221" },
    { id: 194, flag: "🇷🇸", name: "Serbia", code: "RS", dialCode: "+381" },
    { id: 195, flag: "🇸🇨", name: "Seychelles", code: "SC", dialCode: "+248" },
    { id: 196, flag: "🇸🇱", name: "Sierra Leone", code: "SL", dialCode: "+232" },
    { id: 197, flag: "🇸🇬", name: "Singapore", code: "SG", dialCode: "+65" },
    { id: 198, flag: "🇸🇽", name: "Sint Maarten", code: "SX", dialCode: "+1" },
    { id: 199, flag: "🇸🇰", name: "Slovakia", code: "SK", dialCode: "+421" },
    { id: 200, flag: "🇸🇮", name: "Slovenia", code: "SI", dialCode: "+386" },
    { id: 201, flag: "🇸🇧", name: "Solomon Islands", code: "SB", dialCode: "+677" },
    { id: 202, flag: "🇸🇴", name: "Somalia", code: "SO", dialCode: "+252" },
    { id: 203, flag: "🇿🇦", name: "South Africa", code: "ZA", dialCode: "+27" },
    {
        id: 204,
        flag: "🇬🇸",
        name: "South Georgia & South Sandwich Islands",
        code: "GS",
        dialCode: "+500",
    },
    { id: 205, flag: "🇰🇷", name: "South Korea", code: "KR", dialCode: "+82", maxDigits: 9 },
    { id: 206, flag: "🇸🇸", name: "South Sudan", code: "SS", dialCode: "+211" },
    { id: 207, flag: "🇪🇸", name: "Spain", code: "ES", dialCode: "+34", maxDigits: 9 },
    { id: 208, flag: "🇱🇰", name: "Sri Lanka", code: "LK", dialCode: "+94" },
    { id: 209, flag: "🇧🇱", name: "St. Barthélemy", code: "BL", dialCode: "+590" },
    { id: 210, flag: "🇸🇭", name: "St. Helena", code: "SH", dialCode: "+290" },
    { id: 211, flag: "🇰🇳", name: "St. Kitts and Nevis", code: "KN", dialCode: "+1" },
    { id: 212, flag: "🇱🇨", name: "St. Lucia", code: "LC", dialCode: "+1" },
    { id: 213, flag: "🇲🇫", name: "St. Martin", code: "MF", dialCode: "+590" },
    { id: 214, flag: "🇵🇲", name: "St. Pierre and Miquelon", code: "PM", dialCode: "+508" },
    { id: 215, flag: "🇻🇨", name: "St. Vincent and Grenadines", code: "VC", dialCode: "+1" },
    { id: 216, flag: "🇸🇩", name: "Sudan", code: "SD", dialCode: "+249" },
    { id: 217, flag: "🇸🇷", name: "Suriname", code: "SR", dialCode: "+597" },
    { id: 218, flag: "🇸🇯", name: "Svalbard and Jan Mayen", code: "SJ", dialCode: "+47" },
    { id: 219, flag: "🇸🇿", name: "Swaziland", code: "SZ", dialCode: "+268" },
    { id: 220, flag: "🇸🇪", name: "Sweden", code: "SE", dialCode: "+46" },
    { id: 221, flag: "🇸🇾", name: "Syria", code: "SY", dialCode: "+963" },
    { id: 222, flag: "🇹🇼", name: "Taiwan", code: "TW", dialCode: "+886" },
    { id: 223, flag: "🇹🇯", name: "Tajikistan", code: "TJ", dialCode: "+992" },
    { id: 224, flag: "🇹🇿", name: "Tanzania", code: "TZ", dialCode: "+255" },
    { id: 225, flag: "🇹🇭", name: "Thailand", code: "TH", dialCode: "+66" },
    { id: 226, flag: "🇹🇱", name: "Timor-Leste", code: "TL", dialCode: "+670" },
    { id: 227, flag: "🇹🇬", name: "Togo", code: "TG", dialCode: "+228" },
    { id: 228, flag: "🇹🇰", name: "Tokelau", code: "TK", dialCode: "+690" },
    { id: 229, flag: "🇹🇴", name: "Tonga", code: "TO", dialCode: "+676" },
    { id: 230, flag: "🇹🇹", name: "Trinidad and Tobago", code: "TT", dialCode: "+1" },
    { id: 231, flag: "🇹🇳", name: "Tunisia", code: "TN", dialCode: "+216" },
    { id: 232, flag: "🇹🇷", name: "Turkey", code: "TR", dialCode: "+90", maxDigits: 10 },
    { id: 233, flag: "🇹🇲", name: "Turkmenistan", code: "TM", dialCode: "+993" },
    { id: 234, flag: "🇹🇨", name: "Turks and Caicos Islands", code: "TC", dialCode: "+1" },
    { id: 235, flag: "🇹🇻", name: "Tuvalu", code: "TV", dialCode: "+688" },
    { id: 236, flag: "🇺🇬", name: "Uganda", code: "UG", dialCode: "+256" },
    { id: 237, flag: "🇺🇦", name: "Ukraine", code: "UA", dialCode: "+380" },
    { id: 238, flag: "🇦🇪", name: "United Arab Emirates", code: "AE", dialCode: "+971" },
    { id: 239, flag: "🇬🇧", name: "United Kingdom", code: "GB", dialCode: "+44", maxDigits: 10 },
    { id: 240, flag: "🇺🇳", name: "United Nations", code: "UN", dialCode: "+1" },
    { id: 241, flag: "🇨🇳", name: "China", code: "CN", dialCode: "+86", maxDigits: 11 },
    { id: 242, flag: "🇺🇾", name: "Uruguay", code: "UY", dialCode: "+598" },
    { id: 243, flag: "🇺🇿", name: "Uzbekistan", code: "UZ", dialCode: "+998" },
    { id: 244, flag: "🇻🇺", name: "Vanuatu", code: "VU", dialCode: "+678" },
    { id: 245, flag: "🇻🇦", name: "Vatican City", code: "VA", dialCode: "+39" },
    { id: 246, flag: "🇻🇪", name: "Venezuela", code: "VE", dialCode: "+58" },
    { id: 247, flag: "🇻🇳", name: "Vietnam", code: "VN", dialCode: "+84" },
    { id: 248, flag: "🇼🇫", name: "Wallis and Futuna", code: "WF", dialCode: "+681" },
    { id: 249, flag: "🇪🇭", name: "Western Sahara", code: "EH", dialCode: "+212" },
    { id: 250, flag: "🇾🇪", name: "Yemen", code: "YE", dialCode: "+967" },
    { id: 251, flag: "🇿🇲", name: "Zambia", code: "ZM", dialCode: "+260" },
    { id: 252, flag: "🇿🇼", name: "Zimbabwe", code: "ZW", dialCode: "+263" },
    { id: 253, flag: "🇦🇽", name: "Åland Islands", code: "AX", dialCode: "+358" },
].sort((a, b) => a.id - b.id);

export default countries;
