import { GroupingState } from './grouping.model';
import { PaginatorState } from './paginator.model';
import { SortState } from './sort.model';

export interface ITableState {
  filter: {};
  paginator: PaginatorState;
  sorting: SortState;
  searchTerm: string;
  grouping: GroupingState;
  entityId: number | undefined;
}

export interface TableResponseModel<T> {
  content: T[];
  number: number;
  totalPages: number;
  size: number;

  items: T[];
  total: number;
}


export interface ResponseModel<T> {
  idPersonne: number;
  data: any;
  message: string;
  timestamp: Date;
  status: number;
}

export interface DataTablesResponse<T> {
  draw?: number;
  recordsTotal: number;
  recordsFiltered: number;
  data: T[];
}

export interface ICreateAction {
  create(): void;
}

export interface IEditAction {
  edit(id: number): void;
}

export interface IDeleteAction {
  delete(id: number): void;
}

export interface IDeleteSelectedAction {
  grouping: GroupingState;
  ngOnInit(): void;
  deleteSelected(): void;
}

export interface IFetchSelectedAction {
  grouping: GroupingState;
  ngOnInit(): void;
  fetchSelected(): void;
}

export interface IUpdateStatusForSelectedAction {
  grouping: GroupingState;
  ngOnInit(): void;
  updateStatusForSelected(): void;
}
