const API_BASE_URL = "http://localhost:3001";

export interface HeroSectionData {
  badge: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaLink: string;
  imagepath?: {
    __typename: string;
    _path: string;
  };
  imagealt?: string;
}

export const fetchHeroSectionData = async (): Promise<HeroSectionData> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/graphql/execute.json/ransmobile/heroSection`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const data = result.data?.herosectionmodelByPath?.item;

    if (!data) {
      throw new Error("Invalid data structure");
    }

    return data;
  } catch (error) {
    console.error("Error fetching hero section data:", error);
    throw error;
  }
};
