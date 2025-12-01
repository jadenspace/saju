// 일주 분석 데이터
// 60개 일주 × 2 성별 = 120개 조합
// 현재는 주요 일주만 포함, 추후 확장 예정

export interface IljuAnalysis {
  ilju: string; // 일주 (e.g., '甲子', '乙丑')
  male: IljuDetail;
  female: IljuDetail;
}

export interface IljuDetail {
  summary: string; // 한 줄 요약
  personality: string[]; // 주요 성격 특징
  strengths: string[]; // 장점
  weaknesses: string[]; // 단점/주의사항
  career: string; // 적합한 직업
  wealth: string; // 재물운
  relationships: string; // 대인관계/결혼
}

// 일주 데이터베이스
export const ILJU_DATA: IljuAnalysis[] = [
  {
    ilju: '甲子',
    male: {
      summary: '큰 나무가 깊은 물에 뿌리내린 형상으로, 진취적이고 리더십이 강한 성격',
      personality: [
        '진취적이고 나서기를 좋아함',
        '강한 자존심과 자신감',
        '리더십이 뛰어나 조직의 장이 많음',
        '감수성이 풍부하고 지혜로움'
      ],
      strengths: [
        '추진력과 실행력이 뛰어남',
        '어려움을 스스로 극복하는 능력',
        '높은 지적 수준과 분석력'
      ],
      weaknesses: [
        '자존심이 너무 강해 타협이 어려움',
        '자기중심적 사고',
        '때때로 지나친 집착'
      ],
      career: '전문직, 교육, 연구, 상담, 심리학 등 지적 능력이 필요한 분야',
      wealth: '재물운이 비교적 좋은 편. 직장이나 전문직을 통한 안정적 소득',
      relationships: '진지한 연애. 배우자에 대한 헌신적 사랑. 결혼이 다소 늦을 수 있음'
    },
    female: {
      summary: '명랑하고 밝은 성격에 자존심이 강하며, 독립적이고 능력 있는 여성',
      personality: [
        '명랑하고 활동적',
        '호기심이 많고 적극적',
        '강한 자존심과 자기애',
        '감수성이 풍부하고 예술적'
      ],
      strengths: [
        '뛰어난 사교성과 친화력',
        '문제 해결 능력',
        '예술적 재능과 감각'
      ],
      weaknesses: [
        '자존심이 상하면 관계 단절',
        '감정 기복',
        '배우자에 대한 집착'
      ],
      career: '교육, 상담, 예술, 디자인, 미디어 등 창의적 분야',
      wealth: '안정적인 재물운. 저축과 재테크에 유리',
      relationships: '늦은 결혼. 배우자 복이 있으나 어머니의 영향이 큼'
    }
  },
  {
    ilju: '戊戌',
    male: {
      summary: '높은 산처럼 강한 자존심과 책임감을 지닌 의리의 사나이',
      personality: [
        '하늘을 찌를 듯한 자존심',
        '강한 책임감과 의리',
        '고집이 세고 자기 주장이 강함',
        '평소 조용하나 한번 화나면 격렬함'
      ],
      strengths: [
        '뛰어난 실행력과 추진력',
        '신뢰받는 강직한 성품',
        '돈을 버는 능력이 출중'
      ],
      weaknesses: [
        '지나친 보수성과 완고함',
        '타협하지 않는 성향',
        '외로움과 고독감'
      ],
      career: '교육, 공직, 관리자, 경영 컨설팅, 부동산, 건설 등',
      wealth: '돈에 대한 욕심이 많고 실제로 재물을 잘 모음',
      relationships: '자영업 등 함께 일하는 배우자를 선호. 독립적 성향'
    },
    female: {
      summary: '강한 의지와 책임감을 가진 현대적 여성',
      personality: [
        '독립적이고 주관이 뚜렷함',
        '책임감이 강함',
        '안정을 추구하는 성향',
        '다소 보수적'
      ],
      strengths: [
        '실리적이고 현실적',
        '일에 대한 열정',
        '경제관념이 투철'
      ],
      weaknesses: [
        '융통성 부족',
        '감정 표현이 서툴',
        '고집'
      ],
      career: '전문직, 관리직, 교사, 금융, 부동산',
      wealth: '재물운이 좋으며 안정적으로 축적',
      relationships: '배우자 복이 있으나 결혼이 늦을 수 있음'
    }
  },
  {
    ilju: '丙午',
    male: {
      summary: '태양처럼 밝고 열정적이며, 리더십과 추진력이 강한 성격',
      personality: [
        '밝고 외향적',
        '강한 리더십',
        '열정적이고 적극적',
        '정의감이 강함'
      ],
      strengths: [
        '사람을 끌어당기는 매력',
        '뛰어난 추진력',
        '긍정적 에너지'
      ],
      weaknesses: [
        '성급함',
        '감정 기복',
        '지나친 자신감'
      ],
      career: '경영, 영업, 정치, 방송, 스포츠',
      wealth: '큰 돈을 벌 가능성이 높으나 지출도 많음',
      relationships: '활발한 사교. 배우자에게 헌신적'
    },
    female: {
      summary: '화려하고 매력적이며, 사교적이고 활동적인 여성',
      personality: [
        '사교적이고 인기가 많음',
        '자신감 넘침',
        '활발하고 적극적',
        '감성적'
      ],
      strengths: [
        '뛰어난 대인관계 능력',
        '리더십',
        '긍정적 마인드'
      ],
      weaknesses: [
        '감정 조절 어려움',
        '충동적',
        '허영심'
      ],
      career: '서비스업, 판매, 미디어, 연예',
      wealth: '돈은 잘 벌지만 관리가 필요',
      relationships: '연애를 즐기며 결혼 후에도 사회활동 활발'
    }
  },
  {
    ilju: '壬子',
    male: {
      summary: '깊은 바다처럼 지혜롭고 활동적이며, 다재다능한 성격',
      personality: [
        '지혜롭고 총명함',
        '활동적이고 변화를 즐김',
        '적응력이 뛰어남',
        '인정이 많음'
      ],
      strengths: [
        '뛰어난 학습 능력',
        '다방면의 재능',
        '유연한 사고'
      ],
      weaknesses: [
        '우유부단함',
        '한 가지에 집중하기 어려움',
        '감정 기복'
      ],
      career: '연구, 교육, IT, 기획, 무역',
      wealth: '재물의 흐름이 활발. 다양한 수입원',
      relationships: '로맨틱한 연애. 배우자 덕이 있음'
    },
    female: {
      summary: '총명하고 감각적이며, 다재다능한 매력적인 여성',
      personality: [
        '총명하고 지적',
        '예술적 감각',
        '사교적',
        '변화를 즐김'
      ],
      strengths: [
        '뛰어난 감각과 센스',
        '학습 능력',
        '대인관계 능력'
      ],
      weaknesses: [
        '집중력 부족',
        '감정적',
        '산만함'
      ],
      career: '디자인, 예술, 교육, 서비스',
      wealth: '재물운이 있으나 계획적 관리 필요',
      relationships: '이성에게 인기. 낭만적 사랑을 추구'
    }
  },
  {
    ilju: '庚申',
    male: {
      summary: '강한 의지와 추진력을 가진 성공 지향적 인물',
      personality: [
        '강한 의지력',
        '목표 지향적',
        '카리스마 있음',
        '의리를 중시'
      ],
      strengths: [
        '강력한 추진력',
        '결단력',
        '리더십'
      ],
      weaknesses: [
        '고집이 셈',
        '타협하기 어려움',
        '권위적'
      ],
      career: '군인, 경찰, 운동선수, 기업가, 금융',
      wealth: '재물운이 강함. 큰 사업 가능',
      relationships: '남성적 매력. 가정을 책임지는 가장'
    },
    female: {
      summary: '강인하고 독립적이며, 커리어를 중시하는 현대 여성',
      personality: [
        '독립적이고 강함',
        '커리어 지향적',
        '의지가 강함',
        '합리적'
      ],
      strengths: [
        '사회적 성공',
        '경제력',
        '리더십'
      ],
      weaknesses: [
        '감정 표현 서툴',
        '일 중독',
        '완고함'
      ],
      career: '전문직, 경영, 법조, 금융',
      wealth: '재물운이 매우 좋음',
      relationships: '늦은 결혼. 커리어와 가정의 균형 중요'
    }
  }
];

// 일주 조회 함수
export function getIljuAnalysis(ilju: string, gender: 'male' | 'female'): IljuDetail | null {
  const data = ILJU_DATA.find(item => item.ilju === ilju);
  if (!data) return null;
  return data[gender];
}
