interface Restaurant {
  name: string;
  violation: string;
  description: string;
  severity: 'high' | 'medium';
  date: string;
  lat?: number;
  lng?: number;
  image?: string;
}

export const restaurants = [
  {
    name: '명동 김밥',
    violation: 'Critical',
    date: '2024-03-15',
    description: 'Food temperature violation in refrigeration units',
    severity: 'high',
    lat: 37.5634,
    lng: 126.985, // Myeongdong area
  },
  {
    name: '강남 삼겹살',
    violation: 'Critical',
    date: '2024-03-14',
    description: 'Cross-contamination in food preparation area',
    severity: 'high',
    lat: 37.4981,
    lng: 127.0278, // Gangnam Station area
  },
  {
    name: '홍대 치킨',
    violation: 'Critical',
    date: '2024-03-13',
    description: 'Raw meat stored improperly',
    severity: 'high',
    lat: 37.5571,
    lng: 126.9236, // Hongdae area
  },
  {
    name: '이태원 버거',
    violation: 'Non-Critical',
    date: '2024-03-12',
    description: 'Inadequate cleaning of non-food contact surfaces',
    severity: 'medium',
    lat: 37.5344,
    lng: 126.9943, // Itaewon area
  },
  {
    name: '종로 국수',
    violation: 'Non-Critical',
    date: '2024-03-11',
    description: 'Improper storage of cleaning supplies',
    severity: 'medium',
    lat: 37.5704,
    lng: 126.9922, // Jongno area
  },
  {
    name: '신촌 분식',
    violation: 'Critical',
    date: '2024-03-10',
    description: 'Pest infestation in storage area',
    severity: 'high',
    lat: 37.5592,
    lng: 126.9367, // Sinchon area
  },
  {
    name: '건대 치킨',
    violation: 'Non-Critical',
    date: '2024-03-09',
    description: 'Improper employee hygiene practices',
    severity: 'medium',
    lat: 37.5407,
    lng: 127.0694, // Konkuk University area
  },
  {
    name: '잠실 횟집',
    violation: 'Critical',
    date: '2024-03-08',
    description: 'Seafood temperature violations',
    severity: 'high',
    lat: 37.5138,
    lng: 127.1001, // Jamsil area
  },
  {
    name: '신림 순대',
    violation: 'Closure',
    date: '2024-03-15',
    description: 'Severe pest infestation requiring immediate closure',
    severity: 'high',
    lat: 37.4836,
    lng: 126.9297,
  },
  {
    name: '을지로 곱창',
    violation: 'Closure',
    date: '2024-03-14',
    description: 'Sewage backup in food preparation area',
    severity: 'high',
    lat: 37.5662,
    lng: 126.9926,
  },
  {
    name: '노량진 회센터',
    violation: 'Closure',
    date: '2024-03-13',
    description:
      'Critical food safety violations requiring facility renovation',
    severity: 'high',
    lat: 37.5134,
    lng: 126.9422,
  },
  {
    name: '성수 카페',
    violation: 'Warning',
    date: '2024-03-09',
    description: 'Temperature monitoring records incomplete',
    severity: 'medium',
    lat: 37.5445,
    lng: 127.0557,
  },
  {
    name: '압구정 일식당',
    violation: 'Fine',
    date: '2024-03-07',
    description: 'Operating without proper staff certification, ₩300,000 fine',
    severity: 'medium',
    lat: 37.527,
    lng: 127.035,
  },
  {
    name: '서래마을 프렌치',
    violation: 'Fine',
    date: '2024-03-06',
    description: 'Failure to display food safety certificates, ₩200,000 fine',
    severity: 'medium',
    lat: 37.5297,
    lng: 126.9945,
  },
  {
    name: '연남동 베이커리',
    violation: 'Fine',
    date: '2024-03-05',
    description: 'Improper waste disposal procedures, ₩400,000 fine',
    severity: 'medium',
    lat: 37.5605,
    lng: 126.9248,
  },
  {
    name: '동대문 족발',
    violation: 'Critical',
    date: '2024-03-04',
    description: 'Unsafe food handling procedures observed',
    severity: 'high',
    lat: 37.5712,
    lng: 127.0093,
  },
  {
    name: '광화문 한식당',
    violation: 'Critical',
    date: '2024-03-03',
    description: 'Multiple temperature control violations',
    severity: 'high',
    lat: 37.5725,
    lng: 126.9773,
  },
];
