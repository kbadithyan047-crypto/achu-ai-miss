import { LessonSection, QuizQuestion } from '../types';

export const PHYSICS_LESSON_INFO = {
  chapterNumber: 1,
  chapterNameEn: 'Units and Measurements',
  chapterNameMl: 'യൂണിറ്റുകളും അളവുകളും (Units & Measurements)',
  subjectEn: 'Physics (Plus One / Class 11)',
  subjectMl: 'ഫിസിക്സ് (പ്ലസ് വൺ / ക്ലാസ്സ് 11)',
  targetBoard: 'NCERT / Kerala Higher Secondary (DHSE)',
  durationMinutes: 15,
  author: 'Achu AI Physics Faculty',
};

export const PHYSICS_SECTIONS: LessonSection[] = [
  {
    id: 'intro',
    timeline: '00:00 – 02:00',
    durationMinutes: 2,
    titleEn: '1. Introduction: Physical Quantities & Units',
    titleMl: '1. ആമുഖം: ഭൗതിക അളവുകളും യൂണിറ്റുകളും',
    summaryEn: 'Understanding what physical quantities are, why standardized measurement is required, and the difference between numerical value and unit.',
    summaryMl: 'എന്താണ് ഭൗതിക അളവുകൾ (Physical Quantities)? എന്തിനാണ് അളവുകൾ കൃത്യമായി രേഖപ്പെടുത്തുന്നത്? സംഖ്യാമൂല്യവും യൂണിറ്റും തമ്മിലുള്ള വ്യത്യാസം.',
    contentEn: [
      'In Physics, we study nature and natural phenomena through laws. To understand and verify these laws, we must measure physical quantities accurately.',
      'A Physical Quantity is any quantity that can be measured and in terms of which laws of physics are expressed. Examples include length, mass, time, temperature, and force.',
      'Every measurement consists of two essential parts: (1) A numerical value (n), representing how many times the standard is contained, and (2) A unit (u), which is the standard chosen for comparison. Thus, Measurement (Q) = n × u.',
      'For example, if the distance from Thiruvananthapuram to Kochi is 220 kilometres, "220" is the numerical value (n), and "kilometre" is the unit (u). If unit size changes, numerical value changes inversely (n₁u₁ = n₂u₂).',
      'Fundamental Quantities are base quantities independent of others (e.g., length, mass, time). Derived Quantities are expressed in terms of fundamental quantities (e.g., speed = distance / time).',
    ],
    contentMl: [
      'പ്രകൃതിനിയമങ്ങളെ ശാസ്ത്രീയമായി പഠിക്കുന്ന ശാഖയാണ് ഭൗതികശാസ്ത്രം. ഈ നിയമങ്ങൾ തെളിയിക്കാനും പരിശോധിക്കാനും കൃത്യമായ അളവുകൾ (Measurements) കൂടിയേ തീരൂ.',
      'അളക്കാൻ കഴിയുന്നതും ഭൗതികശാസ്ത്ര നിയമങ്ങൾ വിശദീകരിക്കാൻ ഉപയോഗിക്കുന്നതുമായ ഏതൊരു അളവിനെയും "ഭൗതിക അളവ്" (Physical Quantity) എന്ന് വിളിക്കുന്നു. ഉദാഹരണം: നീളം, പിണ്ഡം (Mass), സമയം, താപനില, ബലം.',
      'ഒരു അളവിൽ രണ്ട് പ്രധാന ഭാഗങ്ങൾ അടങ്ങിയിരിക്കുന്നു: (1) സംഖ്യാമൂല്യം (Numerical Value - n), (2) മാനകമായ യൂണിറ്റ് (Unit - u). അതായത്: ഭൗതിക അളവ് (Q) = n × u.',
      'ഉദാഹരണത്തിന്, തിരുവനന്തപുരത്തുനിന്ന് കൊച്ചിയിലേക്കുള്ള ദൂരം 220 കിലോമീറ്റർ ആണെങ്കിൽ, "220" എന്നത് സംഖ്യാമൂല്യവും (n), "കിലോമീറ്റർ" എന്നത് യൂണിറ്റും (u) ആകുന്നു. യൂണിറ്റ് മാറുമ്പോൾ സംഖ്യാമൂല്യവും ആനുപാതികമായി മാറും (n₁u₁ = n₂u₂).',
      'മറ്റ് അളവുകളെ ആശ്രയിക്കാതെ നിൽക്കുന്നവയെ "അടിസ്ഥാന അളവുകൾ" (Fundamental Quantities) എന്നും (ഉദാ: നീളം, സമയം), അവയിൽ നിന്ന് ഉരുത്തിരിഞ്ഞെടുക്കുന്നവയെ "വ്യുൽപ്പന്ന അളവുകൾ" (Derived Quantities) എന്നും പറയുന്നു (ഉദാ: വേഗത = ദൂരം / സമയം).',
    ],
    keyPointsEn: [
      'Measurement = Numerical value (n) × Unit (u).',
      'If unit becomes larger, numerical value becomes smaller: n ∝ 1/u.',
      'Fundamental quantities are independent; Derived quantities depend on fundamental quantities.',
    ],
    keyPointsMl: [
      'അളവ് = സംഖ്യാമൂല്യം (n) × യൂണിറ്റ് (u).',
      'യൂണിറ്റിന്റെ വലിപ്പം കൂടുമ്പോൾ സംഖ്യാമൂല്യം കുറയും (n ∝ 1/u).',
      'അടിസ്ഥാന അളവുകൾ സ്വതന്ത്രമാണ്; വ്യുൽപ്പന്ന അളവുകൾ അടിസ്ഥാന അളവുകളെ ആശ്രയിച്ചിരിക്കുന്നു.',
    ],
    audioNarrationEn:
      'Welcome to Chapter 1: Units and Measurements. Physics is an exact science rooted in precise measurement. Any quantity that can be measured is a physical quantity. Measurement is represented as numerical value times unit, like 10 kilograms. Fundamental quantities stand alone, while derived quantities like speed and force are built from fundamental ones.',
    audioNarrationMl:
      'പ്ലസ് വൺ ഫിസിക്സിലെ ഒന്നാമത്തെ അധ്യായമായ യൂണിറ്റ്സ് ആൻഡ് മെഷർമെന്റിലേക്ക് സ്വാഗതം. അളക്കാൻ സാധിക്കുന്ന ഏതൊരു അളവിനെയും ഫിസിക്കൽ ക്വാണ്ടിറ്റി അഥവാ ഭൗതിക അളവ് എന്ന് പറയുന്നു. ഉദാഹരണത്തിന് 10 കിലോഗ്രാം പഞ്ചസാര എന്ന് പറയുമ്പോൾ 10 എന്നത് സംഖ്യാമൂല്യവും, കിലോഗ്രാം എന്നത് യൂണിറ്റും ആണ്. നീളം, സമയം എന്നിവ അടിസ്ഥാന അളവുകളും, വേഗത, ബലം എന്നിവ വ്യുൽപ്പന്ന അളവുകളുമാണ്.',
  },
  {
    id: 'si-units',
    timeline: '02:00 – 05:00',
    durationMinutes: 3,
    titleEn: '2. The International System of Units (SI Units)',
    titleMl: '2. അന്താരാഷ്ട്ര യൂണിറ്റ് സമ്പ്രദായം (SI Units)',
    summaryEn: 'The 7 base SI quantities, supplementary units (radian and steradian), and derived unit equations with everyday examples.',
    summaryMl: '7 അടിസ്ഥാന SI യൂണിറ്റുകളുടെ പട്ടിക, സപ്ലിമെന്ററി യൂണിറ്റുകൾ, കൂടാതെ നിത്യജീവിതത്തിലെ വ്യുൽപ്പന്ന യൂണിറ്റുകൾ.',
    contentEn: [
      'Historically, systems like CGS (centimetre, gram, second), FPS (foot, pound, second), and MKS were used regionally. In 1971, the General Conference on Weights and Measures adopted the Système International d\'Unités (SI) worldwide.',
      'The SI system is built upon 7 Fundamental (Base) Quantities and 2 Supplementary Units.',
      'Supplementary Units: (1) Plane Angle: radian (rad) = arc length / radius. (2) Solid Angle: steradian (sr) = intercepted area / r².',
      'Derived Units are combinations of base units. For example: Speed = m/s; Acceleration = m/s²; Force = mass × acceleration = kg·m/s² (named Newton, N); Work & Energy = Force × displacement = kg·m²/s² (named Joule, J); Power = Work / time = J/s (named Watt, W).',
    ],
    contentMl: [
      'പണ്ട് കാലങ്ങളിൽ വിവിധ രാജ്യങ്ങളിൽ CGS, FPS, MKS തുടങ്ങിയ വ്യത്യസ്ത സമ്പ്രദായങ്ങളാണ് ഉപയോഗിച്ചിരുന്നത്. എന്നാൽ ലോകമെമ്പാടും ഒരൊറ്റ ഏകീകൃത മാനദണ്ഡം കൊണ്ടുവരാനായി 1971-ൽ അന്താരാഷ്ട്ര അളവുതൂക്ക സമിതി "SI യൂണിറ്റ് സമ്പ്രദായം" അംഗീകരിച്ചു.',
      'SI സമ്പ്രദായത്തിൽ 7 അടിസ്ഥാന യൂണിറ്റുകളും 2 സപ്ലിമെന്ററി യൂണിറ്റുകളും അടങ്ങിയിരിക്കുന്നു.',
      'സപ്ലിമെന്ററി യൂണിറ്റുകൾ: (1) തലം കോൺ (Plane Angle) - റേഡിയൻ (rad). (2) ഖര കോൺ (Solid Angle) - സ്റ്റെറേഡിയൻ (sr).',
      'വ്യുൽപ്പന്ന യൂണിറ്റുകൾ അടിസ്ഥാന യൂണിറ്റുകളുടെ സംയോജനമാണ്. ഉദാഹരണം: പ്രവേഗം = m/s; ത്വരണം (Acceleration) = m/s²; ബലം (Force) = kg·m/s² (ന്യൂട്ടൺ - N); പ്രവൃത്തി (Work) = kg·m²/s² (ജൂൾ - J); പവർ (Power) = J/s (വാട്ട് - W).',
    ],
    tableData: {
      headers: ['Physical Quantity', 'SI Unit', 'Symbol', 'ഭൗതിക അളവ് (മലയാളം)'],
      rows: [
        ['Length', 'metre', 'm', 'നീളം (മീറ്റർ)'],
        ['Mass', 'kilogram', 'kg', 'പിണ്ഡം (കിലോഗ്രാം)'],
        ['Time', 'second', 's', 'സമയം (സെക്കൻഡ്)'],
        ['Electric Current', 'ampere', 'A', 'വൈദ്യുത പ്രവാഹം (ആമ്പിയർ)'],
        ['Thermodynamic Temperature', 'kelvin', 'K', 'താപനില (കെൽവിൻ)'],
        ['Amount of Substance', 'mole', 'mol', 'പദാർത്ഥത്തിന്റെ അളവ് (മോൾ)'],
        ['Luminous Intensity', 'candela', 'cd', 'പ്രകാശ തീവ്രത (കാൻഡല)'],
      ],
    },
    keyPointsEn: [
      '7 SI Base units: m, kg, s, A, K, mol, cd.',
      '2 Supplementary units: radian (plane angle) and steradian (solid angle).',
      'Derived units have special names: 1 N = 1 kg·m/s², 1 J = 1 N·m, 1 W = 1 J/s, 1 Pa = 1 N/m².',
    ],
    keyPointsMl: [
      '7 അടിസ്ഥാന SI യൂണിറ്റുകൾ: മീറ്റർ (m), കിലോഗ്രാം (kg), സെക്കൻഡ് (s), ആമ്പിയർ (A), കെൽവിൻ (K), മോൾ (mol), കാൻഡല (cd).',
      '2 സപ്ലിമെന്ററി യൂണിറ്റുകൾ: റേഡിയൻ (rad), സ്റ്റെറേഡിയൻ (sr).',
      'വ്യുൽപ്പന്ന യൂണിറ്റുകൾ: 1 ന്യൂട്ടൺ = 1 kg·m/s², 1 ജൂൾ = 1 N·m, 1 വാട്ട് = 1 J/s.',
    ],
    audioNarrationEn:
      'Section two covers the SI unit system. Remember the seven base quantities: Length in metres, Mass in kilograms, Time in seconds, Electric current in amperes, Temperature in kelvin, Amount of substance in mole, and Luminous intensity in candela. We also have two supplementary units: radian for plane angles and steradian for solid angles.',
    audioNarrationMl:
      'രണ്ടാമത്തെ ഭാഗം എസ് ഐ യൂണിറ്റ് സമ്പ്രദായമാണ്. ഇതിൽ പ്രധാനമായും ഏഴ് അടിസ്ഥാന അളവുകളാണുള്ളത്: നീളം മീറ്ററിലും, മാസ്സ് കിലോഗ്രാമിലും, സമയം സെക്കൻഡിലും, കറണ്ട് ആമ്പിയറിലും, താപനില കെൽവിനിലും, പദാർത്ഥത്തിന്റെ അളവ് മോളിലും, പ്രകാശ തീവ്രത കാൻഡലയിലും അളക്കുന്നു. റേഡിയൻ, സ്റ്റെറേഡിയൻ എന്നിവ സപ്ലിമെന്ററി യൂണിറ്റുകളാണ്.',
  },
  {
    id: 'dimensions',
    timeline: '05:00 – 08:00',
    durationMinutes: 3,
    titleEn: '3. Dimensions & Dimensional Formulae',
    titleMl: '3. ഡൈമൻഷനുകളും ഡൈമൻഷണൽ ഫോർമുലകളും',
    summaryEn: 'How physical quantities are expressed in terms of powers of fundamental dimensions [M], [L], [T], and step-by-step derivations for Class 11 exams.',
    summaryMl: 'അടിസ്ഥാന അളവുകളുടെ കൃതികളായി (Powers) ഭൗതിക അളവുകളെ സൂചിപ്പിക്കുന്ന വിധം. പരീക്ഷകളിൽ ചോദിക്കുന്ന പ്രധാന ഡൈമൻഷണൽ ഫോർമുലകൾ.',
    contentEn: [
      'The dimensions of a physical quantity are the powers (exponents) to which the base quantities must be raised to represent that quantity.',
      'We represent base dimensions inside square brackets: Mass = [M], Length = [L], Time = [T], Electric Current = [A] or [I], Temperature = [K].',
      'A Dimensional Formula shows which base quantities and what powers are involved. For example, [Velocity] = [M⁰ L¹ T⁻¹].',
      'Step-by-step Derivations:\n' +
        '• Velocity = Displacement / Time = [L] / [T] = [L T⁻¹]\n' +
        '• Acceleration = Velocity / Time = [L T⁻¹] / [T] = [L T⁻²]\n' +
        '• Force = Mass × Acceleration = [M] × [L T⁻²] = [M L T⁻²]\n' +
        '• Work / Energy = Force × Distance = [M L T⁻²] × [L] = [M L² T⁻²]\n' +
        '• Power = Work / Time = [M L² T⁻²] / [T] = [M L² T⁻³]\n' +
        '• Pressure = Force / Area = [M L T⁻²] / [L²] = [M L⁻¹ T⁻²]\n' +
        '• Density = Mass / Volume = [M] / [L³] = [M L⁻³ T⁰]',
    ],
    contentMl: [
      'ഒരു ഭൗതിക അളവിനെ സൂചിപ്പിക്കാൻ അടിസ്ഥാന അളവുകളെ ഉയർത്തേണ്ടി വരുന്ന ഘാതങ്ങളെയാണ് (Powers) ആ അളവിന്റെ "ഡൈമൻഷനുകൾ" (Dimensions) എന്ന് പറയുന്നത്.',
      'അടിസ്ഥാന ഡൈമൻഷനുകൾ: മാസ്സ് = [M], നീളം = [L], സമയം = [T], കറണ്ട് = [A], താപനില = [K]. ഇവയെ ചതുര ബ്രാക്കറ്റിൽ സൂചിപ്പിക്കുന്നു.',
      'പ്രധാന അളവുകളുടെ ഡൈമൻഷൻ കണ്ടുപിടിക്കുന്ന രീതി:\n' +
        '• പ്രവേഗം (Velocity) = ദൂരം / സമയം = [L] / [T] = [M⁰ L T⁻¹]\n' +
        '• ത്വരണം (Acceleration) = പ്രവേഗം / സമയം = [L T⁻¹] / [T] = [M⁰ L T⁻²]\n' +
        '• ബലം (Force) = മാസ്സ് × ത്വരണം = [M] × [L T⁻²] = [M L T⁻²]\n' +
        '• പ്രവൃത്തി / ഊർജ്ജം (Work / Energy) = ബലം × ദൂരം = [M L T⁻²] × [L] = [M L² T⁻²]\n' +
        '• പവർ (Power) = പ്രവൃത്തി / സമയം = [M L² T⁻²] / [T] = [M L² T⁻³]\n' +
        '• മർദ്ദം (Pressure) = ബലം / വിസ്തീർണ്ണം = [M L T⁻²] / [L²] = [M L⁻¹ T⁻²]\n' +
        '• സാന്ദ്രത (Density) = മാസ്സ് / വ്യാപ്തം = [M] / [L³] = [M L⁻³ T⁰]',
    ],
    formulas: [
      { name: 'Velocity / Speed', symbol: 'v', formula: 'd / t', dimension: '[M⁰ L T⁻¹]', unit: 'm/s' },
      { name: 'Acceleration', symbol: 'a', formula: 'Δv / t', dimension: '[M⁰ L T⁻²]', unit: 'm/s²' },
      { name: 'Force', symbol: 'F', formula: 'm × a', dimension: '[M L T⁻²]', unit: 'N (Newton)' },
      { name: 'Work / Energy', symbol: 'W, E', formula: 'F × s', dimension: '[M L² T⁻²]', unit: 'J (Joule)' },
      { name: 'Power', symbol: 'P', formula: 'W / t', dimension: '[M L² T⁻³]', unit: 'W (Watt)' },
      { name: 'Pressure / Stress', symbol: 'P', formula: 'F / A', dimension: '[M L⁻¹ T⁻²]', unit: 'Pa (Pascal)' },
      { name: 'Momentum', symbol: 'p', formula: 'm × v', dimension: '[M L T⁻¹]', unit: 'kg·m/s' },
      { name: 'Density', symbol: 'ρ', formula: 'm / V', dimension: '[M L⁻³ T⁰]', unit: 'kg/m³' },
    ],
    keyPointsEn: [
      'Force is [M L T⁻²] — the most foundational formula in mechanics.',
      'Work, Kinetic Energy, Potential Energy, and Torque all share identical dimensions: [M L² T⁻²].',
      'Angle, strain, refractive index, and relative density are dimensionless: [M⁰ L⁰ T⁰].',
    ],
    keyPointsMl: [
      'ബലത്തിന്റെ (Force) ഡൈമൻഷൻ [M L T⁻²] ആണ് — ഇത് ഏറ്റവും പ്രധാനപ്പെട്ടതാണ്.',
      'പ്രവൃത്തി (Work), ഗതികോർജ്ജം, സ്ഥിതികോർജ്ജം എന്നിവക്കെല്ലാം ഒരേ ഡൈമൻഷനാണ്: [M L² T⁻²].',
      'കോൺ (Angle), സ്ട്രെയിൻ, റിഫ്രാക്റ്റീവ് ഇൻഡക്സ് എന്നിവക്ക് ഡൈമൻഷൻ ഇല്ല: [M⁰ L⁰ T⁰].',
    ],
    audioNarrationEn:
      'Section three explains dimensions. The dimensions of a physical quantity are the powers of fundamental quantities. Velocity is L T minus 1. Acceleration is L T minus 2. Force is M L T minus 2. Work and energy are M L squared T minus 2. Notice that angle, strain, and relative density have zero dimensions.',
    audioNarrationMl:
      'മൂന്നാമത്തെ ഭാഗം ഡൈമൻഷനുകളാണ്. വെലോസിറ്റി എന്നത് എൽ ടി റെയ്സ് ടു മൈനസ് വൺ ആണ്. ആക്സിലറേഷൻ എൽ ടി റെയ്സ് ടു മൈനസ് ടു. ഫോഴ്സ് എം എൽ ടി റെയ്സ് ടു മൈനസ് ടു. വർക്കും എനർജിയും എം എൽ സ്ക്വയർ ടി റെയ്സ് ടു മൈനസ് ടു ആണ്. കോൺ, സ്ട്രെയിൻ തുടങ്ങിയവ ഡൈമൻഷൻ ഇല്ലാത്ത അളവുകളാണ്.',
  },
  {
    id: 'significant-figures',
    timeline: '08:00 – 11:00',
    durationMinutes: 3,
    titleEn: '4. Significant Figures, Errors & Uncertainty',
    titleMl: '4. സിഗ്നിഫിക്കന്റ് ഫിഗറുകളും അളവുകളിലെ തെറ്റുകളും (Errors)',
    summaryEn: 'Rules for counting significant figures, rounding conventions, accuracy vs precision, and calculating absolute, relative, and percentage errors.',
    summaryMl: 'സിഗ്നിഫിക്കന്റ് ഫിഗറുകൾ കണക്കാക്കുന്ന നിയമങ്ങൾ, കൃത്യതയും സൂക്ഷ്മതയും (Accuracy vs Precision), എററുകൾ (Absolute & Percentage Errors).',
    contentEn: [
      'Significant Figures (SF) are reliably known digits in a measured quantity plus the first uncertain digit.',
      'Rules for Counting Significant Figures:\n' +
        '1. All non-zero digits are significant (e.g., 287.5 has 4 SF).\n' +
        '2. All zeros between two non-zero digits are significant (e.g., 2008 has 4 SF, 1.005 has 4 SF).\n' +
        '3. Leading zeros (to the left of the first non-zero digit) are NEVER significant (e.g., 0.0035 has 2 SF).\n' +
        '4. Trailing zeros in a number with a decimal point ARE significant (e.g., 3.500 has 4 SF, 40.0 has 3 SF).\n' +
        '5. In scientific notation (N × 10ᵇ), the power of 10 does not affect significant figures (e.g., 4.70 × 10³ has 3 SF).',
      'Accuracy vs Precision:\n' +
        '• Accuracy measures how close the measured value is to the true value.\n' +
        '• Precision indicates the degree of resolution or limit to which the quantity is measured by the instrument.',
      'Error Calculations:\n' +
        '• Absolute Error (Δa) = |True value - Measured value|\n' +
        '• Relative Error = Mean Absolute Error / Mean Value (Δa_mean / a_mean)\n' +
        '• Percentage Error = Relative Error × 100%',
    ],
    contentMl: [
      'ഒരു അളവെടുപ്പിലെ വിശ്വാസ്യതയുള്ള അക്കങ്ങളും ഒപ്പം അവസാനത്തെ ഒരു അനിശ്ചിത അക്കവും ചേർന്നതിനെയാണ് "സിഗ്നിഫിക്കന്റ് ഫിഗറുകൾ" (Significant Figures) എന്ന് വിളിക്കുന്നത്.',
      'സിഗ്നിഫിക്കന്റ് ഫിഗറുകൾ എണ്ണാനുള്ള നിയമങ്ങൾ:\n' +
        '1. പൂജ്യമല്ലാത്ത എല്ലാ അക്കങ്ങളും സിഗ്നിഫിക്കന്റ് ആണ് (ഉദാ: 287.5 -ൽ 4 എണ്ണം).\n' +
        '2. പൂജ്യമല്ലാത്ത രണ്ട് അക്കങ്ങൾക്കിടയിലുള്ള പൂജ്യങ്ങളെല്ലാം സിഗ്നിഫിക്കന്റ് ആണ് (ഉദാ: 2008 -ൽ 4 എണ്ണം, 1.005 -ൽ 4 എണ്ണം).\n' +
        '3. തുടക്കത്തിലുള്ള പൂജ്യങ്ങൾ (Leading Zeros) ഒരിക്കലും സിഗ്നിഫിക്കന്റ് അല്ല (ഉദാ: 0.0035 -ൽ 2 എണ്ണം മാത്രം).\n' +
        '4. ദശാംശമുള്ള സംഖ്യകളിൽ അവസാനം വരുന്ന പൂജ്യങ്ങൾ സിഗ്നിഫിക്കന്റ് ആണ് (ഉദാ: 3.500 -ൽ 4 എണ്ണം).\n' +
        '5. ശാസ്ത്രീയ രേഖപ്പെടുത്തലിൽ (N × 10ᵇ) പത്തിന്റെ ഘാതം നോക്കേണ്ടതില്ല (ഉദാ: 4.70 × 10³ -ൽ 3 എണ്ണം).',
      'ആക്യുറസിയും പ്രിസിഷനും:\n' +
        '• ആക്യുറസി (Accuracy): അളന്ന മൂല്യം യഥാർത്ഥ മൂല്യത്തോട് എത്രത്തോളം അടുത്താണ് നിൽക്കുന്നത്.\n' +
        '• പ്രിസിഷൻ (Precision): അളക്കാനുപയോഗിച്ച ഉപകരണം എത്രത്തോളം സൂക്ഷ്മമായ വ്യത്യാസങ്ങൾ വരെ രേഖപ്പെടുത്തുന്നു.',
      'എറർ ഫോർമുലകൾ:\n' +
        '• അബ്സൊല്യൂട്ട് എറർ (Absolute Error) = |യഥാർത്ഥ മൂല്യം - അളന്ന മൂല്യം|\n' +
        '• റിലേറ്റീവ് എറർ (Relative Error) = ശരാശരി അബ്സൊല്യൂട്ട് എറർ / ശരാശരി മൂല്യം\n' +
        '• ശതമാന എറർ (Percentage Error) = റിലേറ്റീവ് എറർ × 100%',
    ],
    keyPointsEn: [
      '0.0025 has 2 SF; 2.500 has 4 SF; 205 has 3 SF.',
      'Addition/Subtraction: Final result retains as many decimal places as the number with the least decimal places.',
      'Multiplication/Division: Final result retains as many significant figures as the number with the least significant figures.',
    ],
    keyPointsMl: [
      '0.0025 ൽ 2 സിഗ്നിഫിക്കന്റ് ഫിഗർ; 2.500 ൽ 4 എണ്ണം; 205 ൽ 3 എണ്ണം.',
      'കൂട്ടുമ്പോഴും കുറയ്ക്കുമ്പോഴും ഏറ്റവും കുറവ് ദശാംശ സ്ഥാനമുള്ള സംഖ്യയുടെ അത്രയും സ്ഥാനങ്ങൾ ഉത്തരത്തിലും നിലനിർത്തുക.',
      'ഗുണിക്കുമ്പോഴും ഹരിക്കുമ്പോഴും ഏറ്റവും കുറവ് സിഗ്നിഫിക്കന്റ് ഫിഗറുകളുള്ള സംഖ്യയുടെ അത്രയും നിലനിർത്തുക.',
    ],
    audioNarrationEn:
      'Section four addresses significant figures and errors. Non-zero numbers and sandwich zeros are always significant. Leading zeros never count, while trailing zeros with decimals do count. For instance, zero point zero zero three five has only two significant figures. Accuracy means closeness to true value; precision means measurement resolution.',
    audioNarrationMl:
      'നാലാമത്തെ ഭാഗം സിഗ്നിഫിക്കന്റ് ഫിഗറുകളും എററുകളുമാണ്. പൂജ്യമല്ലാത്ത എല്ലാ അക്കങ്ങളും, അവയ്ക്കിടയിൽ വരുന്ന പൂജ്യങ്ങളും എണ്ണണം. എന്നാൽ തുടക്കത്തിലുള്ള പൂജ്യങ്ങൾ എണ്ണാൻ പാടില്ല. ഉദാഹരണത്തിന് 0.0035 ൽ രണ്ട് സിഗ്നിഫിക്കന്റ് ഫിഗറുകളാണുള്ളത്. യഥാർത്ഥ മൂല്യത്തോട് എത്ര അടുത്താണ് എന്നത് ആക്യുറസിയും, ഉപകരണം എത്ര ചെറുത് വരെ അളക്കുന്നു എന്നത് പ്രിസിഷനുമാണ്.',
  },
  {
    id: 'dimensional-analysis',
    timeline: '11:00 – 13:00',
    durationMinutes: 2,
    titleEn: '5. Applications of Dimensional Analysis',
    titleMl: '5. ഡൈമൻഷണൽ അനാലിസിസിന്റെ പ്രയോഗങ്ങൾ',
    summaryEn: 'Principle of homogeneity, checking correctness of equations, deducing relationships, and critical limitations of dimensional methods.',
    summaryMl: 'ഹോമോജെനിറ്റി തത്വം (Principle of Homogeneity), സമവാക്യങ്ങളുടെ കൃത്യത പരിശോധിക്കൽ, ബന്ധങ്ങൾ രൂപീകരിക്കൽ, പരിമിതികൾ.',
    contentEn: [
      'The Principle of Homogeneity states that a physical equation is correct only if the dimensions of all terms on both sides of the equation are identical.',
      'Application 1: Checking Equation Consistency:\n' +
        'Let us check the kinematic formula: s = u·t + ½·a·t²\n' +
        '• Left-hand side: [s] = [L]\n' +
        '• Term 1: [u·t] = [L T⁻¹] × [T] = [L]\n' +
        '• Term 2: [½·a·t²] = [1] × [L T⁻²] × [T²] = [L] (constants like ½ have no dimensions)\n' +
        'Since all terms have dimension [L], the equation is dimensionally correct!',
      'Application 2: Deriving Relations between Physical Quantities:\n' +
        'For a simple pendulum, time period T depends on mass m, length l, and gravity g. Assuming T = k · mᵃ · lᵇ · gᶜ, we equate dimensions on both sides to find a = 0, b = ½, c = -½, yielding T = k · √(l / g).',
      'Limitations of Dimensional Analysis:\n' +
        '1. It cannot determine dimensionless constants (like 2π or ½).\n' +
        '2. It cannot derive equations involving trigonometric, exponential, or logarithmic functions.\n' +
        '3. It fails when a quantity depends on more than three mechanical variables [M], [L], [T].\n' +
        '4. A dimensionally correct equation may still be physically incorrect.',
    ],
    contentMl: [
      'ഹോമോജെനിറ്റി തത്വം (Principle of Homogeneity): ഒരു സമവാക്യം ശരിയാകണമെങ്കിൽ അതിന്റെ ഇരുവശത്തുമുള്ള എല്ലാ പദങ്ങളുടെയും ഡൈമൻഷനുകൾ തുല്യമായിരിക്കണം.',
      'പ്രയോഗം 1: സമവാക്യത്തിന്റെ സാധുത പരിശോധിക്കൽ:\n' +
        's = u·t + ½·a·t² എന്ന സമവാക്യം പരിശോധിക്കാം:\n' +
        '• ഇടതുവശം: [s] = [L]\n' +
        '• ഒന്നാമത്തെ പദം: [u·t] = [L T⁻¹] × [T] = [L]\n' +
        '• രണ്ടാമത്തെ പദം: [½·a·t²] = [L T⁻²] × [T²] = [L] (½ എന്ന സംഖ്യക്ക് ഡൈമൻഷൻ ഇല്ല)\n' +
        'എല്ലാ പദങ്ങളുടെയും ഡൈമൻഷൻ [L] ആയതിനാൽ ഈ സമവാക്യം ഡൈമൻഷണലി ശരിയാണ്!',
      'പ്രയോഗം 2: ഭൗതിക സമവാക്യങ്ങൾ രൂപീകരിക്കൽ:\n' +
        'ഒരു പെൻഡുലത്തിന്റെ ടൈം പീരിയഡ് (T) നീളത്തെയും (l) ഭൂഗുരുത്വ ത്വരണത്തെയും (g) ആശ്രയിക്കുന്ന ബന്ധം ഡൈമൻഷൻ വഴി കണ്ടുപിടിച്ചാൽ: T = 2π √(l/g) എന്ന് ലഭിക്കുന്നു.',
      'ഡൈമൻഷണൽ അനാലിസിസിന്റെ പരിമിതികൾ:\n' +
        '1. ഡൈമൻഷനില്ലാത്ത സ്ഥിരസംഖ്യകൾ (ഉദാ: 2π, ½) കണ്ടുപിടിക്കാൻ കഴിയില്ല.\n' +
        '2. സൈൻ, കോസ്, ലോഗരിതം, എക്സ്പോണൻഷ്യൽ തുടങ്ങിയ ഫംഗ്ഷനുകൾ അടങ്ങിയ സമവാക്യങ്ങളിൽ ഉപയോഗിക്കാൻ സാധിക്കില്ല.\n' +
        '3. ഒരു സമവാക്യം ഡൈമൻഷണലി ശരിയാണെങ്കിലും ഫിസിക്കലി തെറ്റാകാൻ സാധ്യതയുണ്ട്.',
    ],
    keyPointsEn: [
      'Only terms with identical dimensions can be added or subtracted.',
      'A dimensionally correct equation is not necessarily physically correct, but a dimensionally incorrect equation is always wrong.',
      'Constants of proportionality like 2π must be determined through experiments.',
    ],
    keyPointsMl: [
      'ഒരേ ഡൈമൻഷനുള്ള അളവുകൾ തമ്മിൽ മാത്രമേ കൂട്ടാനോ കുറയ്ക്കാനോ സാധിക്കൂ.',
      'ഡൈമൻഷണലി തെറ്റായ സമവാക്യം എപ്പോഴും തെറ്റാണ്; എന്നാൽ ഡൈമൻഷണലി ശരിയായ സമവാക്യം ഫിസിക്കലി ശരിയാകണമെന്നില്ല.',
      '2π പോലുള്ള സ്ഥിരസംഖ്യകൾ പരീക്ഷണങ്ങളിലൂടെ മാത്രമേ കണ്ടെത്താനാകൂ.',
    ],
    audioNarrationEn:
      'Section five covers dimensional analysis. According to the principle of homogeneity, you can only add or subtract physical quantities having the same dimensions. We verified s equals u t plus half a t squared, where every single term has the dimension of length. Remember its limitation: it cannot calculate dimensionless numerical constants.',
    audioNarrationMl:
      'അഞ്ചാമത്തെ ഭാഗം ഡൈമൻഷണൽ അനാലിസിസ് ആണ്. ഹോമോജെനിറ്റി തത്വമനുസരിച്ച് ഒരേ ഡൈമൻഷനുള്ള പദങ്ങൾ മാത്രമേ കൂട്ടാനും കുറയ്ക്കാനും പറ്റൂ. s = ut + 1/2 at^2 ലെ എല്ലാ പദങ്ങളുടെയും ഡൈമൻഷൻ നീളം അഥവാ L ആണ്. എന്നാൽ 2π പോലുള്ള സംഖ്യകൾ ഇതിലൂടെ കണ്ടെത്താൻ കഴിയില്ല എന്നത് ഇതിന്റെ പ്രധാന പരിമിതിയാണ്.',
  },
  {
    id: 'revision-quiz',
    timeline: '13:00 – 15:00',
    durationMinutes: 2,
    titleEn: '6. Quick Revision & Self-Assessment',
    titleMl: '6. ദ്രുത റിവിഷനും സ്വയം വിലയിരുത്തലും (Quiz)',
    summaryEn: 'Complete 15-minute lecture summary, master formula sheet, and interactive 10-question self-assessment test with instant scoring.',
    summaryMl: 'പൂർണ്ണ റിവിഷൻ ചാർട്ട്, പ്രധാന ഫോർമുലകൾ, പരീക്ഷാ ചോദ്യങ്ങളടങ്ങിയ 10 ചോദ്യങ്ങളുടെ ഇന്ററാക്ടീവ് ക്വിസ്.',
    contentEn: [
      'Congratulations on completing the 15-Minute Physics masterclass on Units and Measurements!',
      'Rapid Formula Recap:\n' +
        '• Force = [M L T⁻²]\n' +
        '• Work = Energy = Torque = [M L² T⁻²]\n' +
        '• Power = [M L² T⁻³]\n' +
        '• Pressure = [M L⁻¹ T⁻²]\n' +
        '• Gravitational Constant G = [M⁻¹ L³ T⁻²]\n' +
        '• Planck\'s Constant h = [M L² T⁻¹]',
      'Now test your understanding with our interactive 10-question quiz below. Every question contains instant evaluation, correct answer keys, and step-by-step explanations designed for your exams.',
    ],
    contentMl: [
      'യൂണിറ്റുകളും അളവുകളും എന്ന അധ്യായത്തിന്റെ 15 മിനിറ്റ് മാസ്റ്റർ ക്ലാസ്സ് നിങ്ങൾ വിജയകരമായി പൂർത്തിയാക്കിയിരിക്കുന്നു!',
      'പ്രധാന ഫോർമുലകൾ ഒരു നോട്ടത്തിൽ:\n' +
        '• ബലം (Force) = [M L T⁻²]\n' +
        '• പ്രവൃത്തി / ഊർജ്ജം (Work / Energy) = [M L² T⁻²]\n' +
        '• പവർ (Power) = [M L² T⁻³]\n' +
        '• മർദ്ദം (Pressure) = [M L⁻¹ T⁻²]\n' +
        '• ഗുരുത്വാകർഷണ സ്ഥിരാങ്കം (G) = [M⁻¹ L³ T⁻²]\n' +
        '• പ്ലാങ്ക്സ് കോൺസ്റ്റന്റ് (h) = [M L² T⁻¹]',
      'ഇനി നിങ്ങളുടെ അറിവ് സ്വയം പരിശോധിക്കാനായി താഴെയുള്ള 10 ചോദ്യങ്ങളടങ്ങിയ ക്വിസ് ചെയ്തു നോക്കൂ. ഓരോ ഉത്തരത്തിനും കൃത്യമായ വിശദീകരണവും നൽകിയിട്ടുണ്ട്.',
    ],
    keyPointsEn: [
      'Master the core dimensions: Force [M L T⁻²] and Work [M L² T⁻²].',
      'Pay attention to significant figure rules on exams.',
      'Check consistency using Principle of Homogeneity before finalizing numerical answers.',
    ],
    keyPointsMl: [
      'ഫോഴ്സ് [M L T⁻²], വർക്ക് [M L² T⁻²] എന്നിവ നന്നായി ഓർത്തു വെക്കുക.',
      'പരീക്ഷകളിൽ സിഗ്നിഫിക്കന്റ് ഫിഗറുകളുടെ റൗണ്ടിംഗ് റൂളുകൾ ശ്രദ്ധിക്കുക.',
      'ക്വിസിലെ 10 ചോദ്യങ്ങളും ചെയ്തു പരിശീലിച്ച് സ്കോർ വിലയിരുത്തുക.',
    ],
    audioNarrationEn:
      'Congratulations! You have completed the 15-minute class on Units and Measurements. Review the master dimensions: Force is M L T minus 2, Work is M L squared T minus 2, and Pressure is M L minus 1 T minus 2. Now, proceed to the self-assessment quiz to test your exam readiness.',
    audioNarrationMl:
      'അഭിനന്ദനങ്ങൾ! പ്ലസ് വൺ ഫിസിക്സിലെ യൂണിറ്റ്സ് ആൻഡ് മെഷർമെന്റ് ക്ലാസ്സ് പൂർത്തിയായിരിക്കുന്നു. ബലത്തിന്റെ ഡൈമൻഷൻ M L T^-2 ഉം, പ്രവൃത്തിയുടേത് M L^2 T^-2 ഉം ആണ്. ഇനി നിങ്ങളുടെ ധാരണ പരിശോധിക്കാനായി താഴെയുള്ള ക്വിസ് ചെയ്തു നോക്കൂ. ഓൾ ദി ബെസ്റ്റ്!',
  },
];

export const PHYSICS_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    sectionId: 'intro',
    category: 'si-unit',
    questionEn: 'Which of the following is NOT one of the 7 fundamental SI base quantities?',
    questionMl: 'താഴെ പറയുന്നവയിൽ ഏതാണ് 7 അടിസ്ഥാന SI അളവുകളിൽ ഉൾപ്പെടാത്തത്?',
    optionsEn: ['Electric Current', 'Luminous Intensity', 'Force', 'Amount of Substance'],
    optionsMl: ['വൈദ്യുത പ്രവാഹം (Electric Current)', 'പ്രകാശ തീവ്രത (Luminous Intensity)', 'ബലം (Force)', 'പദാർത്ഥത്തിന്റെ അളവ് (Amount of Substance)'],
    correctIndex: 2,
    explanationEn: 'Force is a derived quantity (mass × acceleration, unit Newton). Electric current (A), Luminous intensity (cd), and Amount of substance (mol) are fundamental base quantities.',
    explanationMl: 'ബലം (Force) എന്നത് അടിസ്ഥാന അളവല്ല, മറിച്ച് ഒരു വ്യുൽപ്പന്ന അളവാണ് (Derived Quantity). വൈദ്യുത പ്രവാഹം, പ്രകാശ തീവ്രത, പദാർത്ഥത്തിന്റെ അളവ് എന്നിവ അടിസ്ഥാന അളവുകളാണ്.',
  },
  {
    id: 'q2',
    sectionId: 'si-units',
    category: 'si-unit',
    questionEn: 'What is the SI supplementary unit for measuring a Solid Angle?',
    questionMl: 'ഒരു ഖര കോൺ (Solid Angle) അളക്കുന്നതിനുള്ള SI സപ്ലിമെന്ററി യൂണിറ്റ് ഏതാണ്?',
    optionsEn: ['Radian', 'Degree', 'Steradian', 'Candela'],
    optionsMl: ['റേഡിയൻ (Radian)', 'ഡിഗ്രി (Degree)', 'സ്റ്റെറേഡിയൻ (Steradian)', 'കാൻഡല (Candela)'],
    correctIndex: 2,
    explanationEn: 'The SI unit for plane angle is radian (rad), while the SI unit for solid angle is steradian (sr).',
    explanationMl: 'തലം കോണിന്റെ (Plane Angle) യൂണിറ്റ് റേഡിയനും, ഖര കോണിന്റെ (Solid Angle) യൂണിറ്റ് സ്റ്റെറേഡിയനും (sr) ആകുന്നു.',
  },
  {
    id: 'q3',
    sectionId: 'dimensions',
    category: 'formula',
    questionEn: 'What is the dimensional formula of Force?',
    questionMl: 'ബലത്തിന്റെ (Force) ഡൈമൻഷണൽ ഫോർമുല ഏതാണ്?',
    optionsEn: ['[M L T⁻¹]', '[M L T⁻²]', '[M L² T⁻²]', '[M L⁻¹ T⁻²]'],
    optionsMl: ['[M L T⁻¹]', '[M L T⁻²]', '[M L² T⁻²]', '[M L⁻¹ T⁻²]'],
    correctIndex: 1,
    explanationEn: 'Force = mass × acceleration = [M] × [L T⁻²] = [M L T⁻²].',
    explanationMl: 'ബലം = മാസ്സ് × ത്വരണം = [M] × [L T⁻²] = [M L T⁻²].',
  },
  {
    id: 'q4',
    sectionId: 'dimensions',
    category: 'concept',
    questionEn: 'Which pair of physical quantities share the exact same dimensional formula?',
    questionMl: 'താഴെ പറയുന്ന ജോഡികളിൽ ഒരേ ഡൈമൻഷണൽ ഫോർമുല പങ്കിടുന്നവ ഏതെല്ലാമാണ്?',
    optionsEn: [
      'Force and Work',
      'Work and Kinetic Energy',
      'Momentum and Force',
      'Power and Energy',
    ],
    optionsMl: [
      'ബലവും പ്രവൃത്തിയും (Force & Work)',
      'പ്രവൃത്തിയും ഗതികോർജ്ജവും (Work & Kinetic Energy)',
      'ആക്കവും ബലവും (Momentum & Force)',
      'പവറും ഊർജ്ജവും (Power & Energy)',
    ],
    correctIndex: 1,
    explanationEn: 'Work and all forms of Energy (Kinetic, Potential) have the identical dimensional formula: [M L² T⁻²].',
    explanationMl: 'പ്രവൃത്തിക്കും (Work) ഗതികോർജ്ജം, സ്ഥിതികോർജ്ജം തുടങ്ങിയ എല്ലാത്തരം ഊർജ്ജങ്ങൾക്കും ഒരേ ഡൈമൻഷനാണ്: [M L² T⁻²].',
  },
  {
    id: 'q5',
    sectionId: 'dimensions',
    category: 'concept',
    questionEn: 'Which of the following physical quantities is completely dimensionless?',
    questionMl: 'താഴെ പറയുന്നതിൽ ഡൈമൻഷൻ ഇല്ലാത്ത (Dimensionless) അളവ് ഏതാണ്?',
    optionsEn: ['Pressure', 'Strain', 'Acceleration', 'Velocity'],
    optionsMl: ['മർദ്ദം (Pressure)', 'സ്ട്രെയിൻ (Strain)', 'ത്വരണം (Acceleration)', 'പ്രവേഗം (Velocity)'],
    correctIndex: 1,
    explanationEn: 'Strain is the ratio of change in dimension to original dimension (ΔL/L), so it has no dimensions: [M⁰ L⁰ T⁰].',
    explanationMl: 'സ്ട്രെയിൻ (Strain) എന്നാൽ ഒരേ അളവുകളുടെ അനുപാതമാണ് (ΔL/L). അതിനാൽ ഇതിന് യൂണിറ്റോ ഡൈമൻഷനോ ഇല്ല ([M⁰ L⁰ T⁰]).',
  },
  {
    id: 'q6',
    sectionId: 'significant-figures',
    category: 'numerical',
    questionEn: 'How many significant figures are in the measured value 0.005080?',
    questionMl: '0.005080 എന്ന അളവിൽ എത്ര സിഗ്നിഫിക്കന്റ് ഫിഗറുകൾ (Significant Figures) ഉണ്ട്?',
    optionsEn: ['6', '3', '4', '5'],
    optionsMl: ['6', '3', '4', '5'],
    correctIndex: 2,
    explanationEn: 'Leading zeros (0.00) are not significant. The digits 5, 0 (between 5 and 8), 8, and the trailing zero 0 after decimal are all significant: 5, 0, 8, 0 = 4 significant figures.',
    explanationMl: 'തുടക്കത്തിലുള്ള പൂജ്യങ്ങൾ (0.00) എണ്ണാൻ പാടില്ല. എന്നാൽ 5, അതിനിടയിലെ 0, 8, ഒടുവിലെ 0 എന്നിവയെല്ലാം ചേർത്ത് ആകെ 4 സിഗ്നിഫിക്കന്റ് ഫിഗറുകളുണ്ട്.',
  },
  {
    id: 'q7',
    sectionId: 'significant-figures',
    category: 'numerical',
    questionEn: 'Evaluate 2.45 m + 0.1 m with proper respect to significant figures.',
    questionMl: 'സിഗ്നിഫിക്കന്റ് ഫിഗർ നിയമപ്രകാരം 2.45 m + 0.1 m ന്റെ ശരിയായ മൂല്യം എത്രയാണ്?',
    optionsEn: ['2.55 m', '2.6 m', '2.5 m', '2.550 m'],
    optionsMl: ['2.55 m', '2.6 m', '2.5 m', '2.550 m'],
    correctIndex: 1,
    explanationEn: '2.45 + 0.1 = 2.55. In addition, the answer cannot have more decimal places than the least precise measurement (0.1 has only 1 decimal place). Rounding 2.55 to 1 decimal place gives 2.6 m.',
    explanationMl: '2.45 + 0.1 = 2.55. കൂട്ടിയ ശേഷം ഉത്തരത്തിൽ ഏറ്റവും കുറവ് ദശാംശ സ്ഥാനമുള്ള സംഖ്യയുടെ (0.1 ൽ 1 സ്ഥാനം) അത്രയുമേ വരാൻ പാടുള്ളൂ. അതിനാൽ 2.55 നെ റൗണ്ട് ചെയ്യുമ്പോൾ 2.6 m എന്ന് ലഭിക്കുന്നു.',
  },
  {
    id: 'q8',
    sectionId: 'dimensional-analysis',
    category: 'formula',
    questionEn: 'According to the Principle of Homogeneity, two physical terms can be added only if:',
    questionMl: 'ഹോമോജെനിറ്റി തത്വമനുസരിച്ച് (Principle of Homogeneity) രണ്ട് പദങ്ങൾ കൂട്ടാൻ സാധിക്കുന്നത് എപ്പോൾ മാത്രമാണ്?',
    optionsEn: [
      'They have the same numerical value',
      'They have identical dimensions',
      'They have different units',
      'Both are scalar quantities',
    ],
    optionsMl: [
      'അവയുടെ സംഖ്യാമൂല്യം തുല്യമാകുമ്പോൾ',
      'അവക്ക് ഒരേ ഡൈമൻഷൻ ഉണ്ടാകുമ്പോൾ',
      'വ്യത്യസ്ത യൂണിറ്റുകൾ ഉള്ളപ്പോൾ',
      'രണ്ടും അദിശ അളവുകൾ (Scalars) ആകുമ്പോൾ',
    ],
    correctIndex: 1,
    explanationEn: 'The Principle of Homogeneity states that terms added or subtracted must possess identical dimensional formulae (e.g., length can only be added to length).',
    explanationMl: 'ഹോമോജെനിറ്റി തത്വമനുസരിച്ച് ഒരേ ഡൈമൻഷനുള്ള അളവുകൾ തമ്മിൽ മാത്രമേ പരസ്പരം കൂട്ടാനോ കുറയ്ക്കാനോ സാധിക്കുകയുള്ളൂ.',
  },
  {
    id: 'q9',
    sectionId: 'dimensions',
    category: 'formula',
    questionEn: 'What is the dimensional formula of Pressure (Force per unit Area)?',
    questionMl: 'മർദ്ദത്തിന്റെ (Pressure) ഡൈമൻഷണൽ ഫോർമുല എന്താണ്?',
    optionsEn: ['[M L⁻¹ T⁻²]', '[M L T⁻²]', '[M L² T⁻¹]', '[M L⁻² T⁻²]'],
    optionsMl: ['[M L⁻¹ T⁻²]', '[M L T⁻²]', '[M L² T⁻¹]', '[M L⁻² T⁻²]'],
    correctIndex: 0,
    explanationEn: 'Pressure = Force / Area = [M L T⁻²] / [L²] = [M L⁻¹ T⁻²].',
    explanationMl: 'മർദ്ദം = ബലം / വിസ്തീർണ്ണം = [M L T⁻²] / [L²] = [M L⁻¹ T⁻²].',
  },
  {
    id: 'q10',
    sectionId: 'dimensional-analysis',
    category: 'concept',
    questionEn: 'Which of the following is a limitation of dimensional analysis?',
    questionMl: 'താഴെ പറയുന്നവയിൽ ഡൈമൻഷണൽ അനാലിസിസിന്റെ പ്രധാന പരിമിതി ഏതാണ്?',
    optionsEn: [
      'It cannot check equation consistency',
      'It cannot determine dimensionless constants like 2π',
      'It cannot find SI units',
      'It only applies to mass',
    ],
    optionsMl: [
      'സമവാക്യങ്ങളുടെ ശരിതെറ്റുകൾ പരിശോധിക്കാൻ കഴിയില്ല',
      '2π പോലുള്ള ഡൈമൻഷനില്ലാത്ത സ്ഥിരസംഖ്യകൾ കണ്ടുപിടിക്കാൻ കഴിയില്ല',
      'എസ് ഐ യൂണിറ്റുകൾ കണ്ടെത്താൻ കഴിയില്ല',
      'മാസിന് മാത്രമേ ഇത് ഉപയോഗിക്കാൻ പറ്റൂ',
    ],
    correctIndex: 1,
    explanationEn: 'Dimensional analysis cannot determine numerical dimensionless proportionality constants like 2π or ½; these must be found experimentally or theoretically.',
    explanationMl: 'ഡൈമൻഷൻ ഇല്ലാത്ത സ്ഥിരസംഖ്യകൾ (ഉദാ: 2π, 1/2) കണ്ടുപിടിക്കാൻ ഡൈമൻഷണൽ അനാലിസിസിന് സാധിക്കില്ല എന്നത് ഇതിന്റെ പ്രധാന പരിമിതിയാണ്.',
  },
];
