import axiosInstance from '../../services/axiosConfig';

// 轮播图数据类型
export interface CarouselImage {
  imageUrl: string;
  isShow: '0' | '1';
}

// 主要产品数据类型
export interface MainProduct {
  productName: string;
  imageUrl: string;
	jumpUrl?: string;
}

// 典型客户数据类型
export interface TypicalCustomers {
  imageUrl: string;
}

// 首页数据响应类型
export interface MainPageData {
  isPublish: '0' | '1';
  // 非预览模式字段
  carouselImageLists: CarouselImage[];
  mainProducts: MainProduct[];
  typicalCustomer: TypicalCustomers;
  // 预览模式字段
  carouselImageListsTemp: CarouselImage[];
  mainProductsTemp: MainProduct[];
  typicalCustomerTemp: TypicalCustomers;
}

// 通用响应类型定义
export interface ApiResponse<T = any> {
  code: number;
  msg: string;
  data: T;
}

/**
 * 获取首页展示内容
 * @returns Promise<ApiResponse<MainPageData>>
 */
export function getMainPageContent(isPreview: boolean): Promise<ApiResponse<MainPageData>> {
  // 检查是否为预览模式且URL参数中包含type=mainPage
  let usePreviewEndpoint = false;
  
  if (isPreview && typeof window !== 'undefined') {
    const searchParams = new URLSearchParams(window.location.search);
    usePreviewEndpoint = searchParams.get('type') === 'mainPage';
  }
  
  // 根据条件选择不同的API端点
  const endpoint = usePreviewEndpoint
    ? '/crm-website/homepageConfig/preview' 
    : '/crm-website/homepageConfig/display';
  return axiosInstance.get(endpoint);
}