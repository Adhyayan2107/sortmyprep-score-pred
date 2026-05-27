export interface IBThreshold {
  competitive: number
  borderline: number
  reach: number
}

export interface GradeThreshold {
  competitive: string
  borderline: string
  reach: string
}

export interface University {
  id: string
  name: string
  location: string
  offers: {
    ib: IBThreshold
    alevel: GradeThreshold
    igcse: GradeThreshold
    as: GradeThreshold
  }
}

export const UNIVERSITIES: University[] = [
  {
    id: 'oxford',
    name: 'Oxford',
    location: 'Oxford, UK',
    offers: {
      ib:     { competitive: 42, borderline: 40, reach: 38 },
      alevel: { competitive: 'A*A*A', borderline: 'A*AA', reach: 'AAA' },
      igcse:  { competitive: 'A*A*A*', borderline: 'A*A*A', reach: 'A*AA' },
      as:     { competitive: 'AAA', borderline: 'AAB', reach: 'ABB' },
    },
  },
  {
    id: 'cambridge',
    name: 'Cambridge',
    location: 'Cambridge, UK',
    offers: {
      ib:     { competitive: 42, borderline: 40, reach: 38 },
      alevel: { competitive: 'A*A*A', borderline: 'A*AA', reach: 'AAA' },
      igcse:  { competitive: 'A*A*A*', borderline: 'A*A*A', reach: 'A*AA' },
      as:     { competitive: 'AAA', borderline: 'AAB', reach: 'ABB' },
    },
  },
  {
    id: 'imperial',
    name: 'Imperial',
    location: 'London, UK',
    offers: {
      ib:     { competitive: 40, borderline: 38, reach: 36 },
      alevel: { competitive: 'A*AA', borderline: 'AAA', reach: 'AAB' },
      igcse:  { competitive: 'A*A*A', borderline: 'A*AA', reach: 'AAA' },
      as:     { competitive: 'AAA', borderline: 'AAB', reach: 'ABB' },
    },
  },
  {
    id: 'lse',
    name: 'LSE',
    location: 'London, UK',
    offers: {
      ib:     { competitive: 39, borderline: 37, reach: 35 },
      alevel: { competitive: 'A*AA', borderline: 'AAA', reach: 'AAB' },
      igcse:  { competitive: 'A*A*A', borderline: 'A*AA', reach: 'AAA' },
      as:     { competitive: 'AAA', borderline: 'AAB', reach: 'ABB' },
    },
  },
  {
    id: 'ucl',
    name: 'UCL',
    location: 'London, UK',
    offers: {
      ib:     { competitive: 38, borderline: 36, reach: 33 },
      alevel: { competitive: 'A*AA', borderline: 'AAA', reach: 'ABB' },
      igcse:  { competitive: 'A*A*A', borderline: 'A*AA', reach: 'AAB' },
      as:     { competitive: 'AAA', borderline: 'AAB', reach: 'ABB' },
    },
  },
  {
    id: 'kings',
    name: "King's College",
    location: 'London, UK',
    offers: {
      ib:     { competitive: 36, borderline: 34, reach: 32 },
      alevel: { competitive: 'AAA', borderline: 'AAB', reach: 'ABB' },
      igcse:  { competitive: 'A*AA', borderline: 'AAA', reach: 'AAB' },
      as:     { competitive: 'AAB', borderline: 'ABB', reach: 'BBB' },
    },
  },
  {
    id: 'warwick',
    name: 'Warwick',
    location: 'Coventry, UK',
    offers: {
      ib:     { competitive: 38, borderline: 36, reach: 33 },
      alevel: { competitive: 'A*AA', borderline: 'AAA', reach: 'AAB' },
      igcse:  { competitive: 'A*A*A', borderline: 'A*AA', reach: 'AAA' },
      as:     { competitive: 'AAA', borderline: 'AAB', reach: 'ABB' },
    },
  },
  {
    id: 'edinburgh',
    name: 'Edinburgh',
    location: 'Edinburgh, UK',
    offers: {
      ib:     { competitive: 37, borderline: 35, reach: 32 },
      alevel: { competitive: 'AAA', borderline: 'AAB', reach: 'ABB' },
      igcse:  { competitive: 'A*AA', borderline: 'AAA', reach: 'AAB' },
      as:     { competitive: 'AAB', borderline: 'ABB', reach: 'BBB' },
    },
  },
  {
    id: 'bristol',
    name: 'Bristol',
    location: 'Bristol, UK',
    offers: {
      ib:     { competitive: 36, borderline: 34, reach: 32 },
      alevel: { competitive: 'AAA', borderline: 'AAB', reach: 'ABB' },
      igcse:  { competitive: 'A*AA', borderline: 'AAA', reach: 'AAB' },
      as:     { competitive: 'AAB', borderline: 'ABB', reach: 'BBB' },
    },
  },
  {
    id: 'manchester',
    name: 'Manchester',
    location: 'Manchester, UK',
    offers: {
      ib:     { competitive: 35, borderline: 33, reach: 30 },
      alevel: { competitive: 'AAB', borderline: 'ABB', reach: 'BBB' },
      igcse:  { competitive: 'AAA', borderline: 'AAB', reach: 'ABB' },
      as:     { competitive: 'ABB', borderline: 'BBB', reach: 'BBC' },
    },
  },
  {
    id: 'nus',
    name: 'NUS',
    location: 'Singapore',
    offers: {
      ib:     { competitive: 40, borderline: 38, reach: 35 },
      alevel: { competitive: 'A*AA', borderline: 'AAA', reach: 'AAB' },
      igcse:  { competitive: 'A*A*A', borderline: 'A*AA', reach: 'AAA' },
      as:     { competitive: 'AAA', borderline: 'AAB', reach: 'ABB' },
    },
  },
  {
    id: 'ntu',
    name: 'NTU',
    location: 'Singapore',
    offers: {
      ib:     { competitive: 38, borderline: 36, reach: 33 },
      alevel: { competitive: 'AAA', borderline: 'AAB', reach: 'ABB' },
      igcse:  { competitive: 'A*AA', borderline: 'AAA', reach: 'AAB' },
      as:     { competitive: 'AAB', borderline: 'ABB', reach: 'BBB' },
    },
  },
  {
    id: 'mcgill',
    name: 'McGill',
    location: 'Montreal, Canada',
    offers: {
      ib:     { competitive: 36, borderline: 34, reach: 31 },
      alevel: { competitive: 'AAA', borderline: 'AAB', reach: 'ABB' },
      igcse:  { competitive: 'A*AA', borderline: 'AAA', reach: 'AAB' },
      as:     { competitive: 'AAB', borderline: 'ABB', reach: 'BBB' },
    },
  },
  {
    id: 'nyu',
    name: 'NYU',
    location: 'New York, USA',
    offers: {
      ib:     { competitive: 36, borderline: 33, reach: 30 },
      alevel: { competitive: 'AAB', borderline: 'ABB', reach: 'BBB' },
      igcse:  { competitive: 'AAA', borderline: 'AAB', reach: 'ABB' },
      as:     { competitive: 'ABB', borderline: 'BBB', reach: 'BBC' },
    },
  },
]

export const POPULAR_UNI_IDS = [
  'ucl','lse','imperial','warwick','oxford','cambridge','edinburgh','nus','mcgill','nyu','kings',
]

export const COURSE_LABELS: Record<string, string> = {
  medicine:    'Medicine',
  engineering: 'Engineering',
  cs:          'Computer Science',
  economics:   'Economics',
  law:         'Law',
  sciences:    'Natural Sciences',
  humanities:  'Humanities',
  business:    'Business',
  arts:        'Arts & Design',
}
