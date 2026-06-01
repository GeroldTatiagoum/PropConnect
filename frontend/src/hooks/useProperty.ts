import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store';
import {
  fetchProperties,
  fetchPropertyById,
  fetchMyProperties,
  createProperty,
  setFilters,
  clearCurrentProperty,
  selectProperties,
  selectCurrentProperty,
  selectMyProperties,
  selectPropertyFilters,
  selectPropertyPagination,
  selectPropertiesLoading,
} from '@/store/properties.slice';
import { PropertyFilters, CreatePropertyDto } from '@/types/property.types';

export function useProperty() {
  const dispatch = useDispatch<AppDispatch>();
  const properties = useSelector(selectProperties);
  const currentProperty = useSelector(selectCurrentProperty);
  const myProperties = useSelector(selectMyProperties);
  const filters = useSelector(selectPropertyFilters);
  const pagination = useSelector(selectPropertyPagination);
  const loading = useSelector(selectPropertiesLoading);

  return {
    properties,
    currentProperty,
    myProperties,
    filters,
    pagination,
    loading,
    fetchProperties: (params?: { filters?: PropertyFilters; page?: number; limit?: number }) =>
      dispatch(fetchProperties(params ?? {})),
    fetchPropertyById: (id: string) => dispatch(fetchPropertyById(id)),
    fetchMyProperties: () => dispatch(fetchMyProperties()),
    createProperty: (dto: CreatePropertyDto) => dispatch(createProperty(dto)),
    setFilters: (f: PropertyFilters) => dispatch(setFilters(f)),
    clearCurrentProperty: () => dispatch(clearCurrentProperty()),
  };
}
