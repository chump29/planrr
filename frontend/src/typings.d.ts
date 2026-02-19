declare module "*.css"

// import { type ExpandableRowsComponent } from "react-data-table-component/dist/DataTable/types"
type ExpandableRowsComponent<T> = React.ComponentType<ExpanderComponentProps<T>>
