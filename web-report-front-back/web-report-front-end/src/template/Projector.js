import React, {Component} from 'react';
import * as _ from "lodash";
import OperationContainer from "../partial/OperationContainer";
import WebTable from "../partial/WebTable";
import ProjectorFilterContainer from "../partial/FilterContainers/ProjectorFilterContainer";
import * as moment from "moment";


const headers = [{key: 'tms__id', value: 'TMS ID', sortable: true},
    {key: 'tms_circuit_name', value: 'Circuit', sortable: false},
    {key: 'tms__name', value: 'Name', sortable: true},
    {key: 'type', value: 'Projector Type', sortable: true},
    {key: 'serial', value: 'Projector Serial', sortable: true},
    {key: 'lamp_usage', value: 'Lamp Usage', sortable: true},
];


class Projector extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            headers,
            loading: true,
            filteredHeaders: headers,
            filterColumns: [],
            items: [],
            filterItems: {
                tms_name: [],
                type: []
            },
            displayColumns: ''
        }
    }

    componentDidMount() {
        this._isMounted = true;
        let queryParams = new URLSearchParams(this.props.location.search);
        this.getFilterSelections();
        this.getParamsAndRefresh(queryParams);

        this.unlisten = this.props.history.listen((location, action) => {
            if(this.props.location.pathname === location.pathname) {
                let queryParams = new URLSearchParams(location.search);
                this.getParamsAndRefresh(queryParams);
            }
        });
    }
    getParamsAndRefresh(queryParams) {
        let limit = +queryParams.get("limit") || 20;
        let page = +queryParams.get("page") || 1;
        let order_by = queryParams.get("order_by");
        let tms_name = queryParams.get("tms_name");
        let type = queryParams.get("type");
        let display_columns = queryParams.get('display');
        display_columns = display_columns != null ? display_columns : headers.map(x => {
            return x.value + ","
        });
        let displayColumnsAsArray = _.split(display_columns, ',').filter(x => x !== "");
        let filterColumns = _.map(displayColumnsAsArray, (x, i) => {
            return _.findIndex(this.state.headers, y => {
                return y.value === x;
            })
        });
        if (this.state.displayColumns === '' || _.isEqual(display_columns, this.state.displayColumns)) {
            this.setState({loading: true});
            this.fetchData({
                page,
                limit,
                order_by,
                tms_name,
                type,
                display_columns: displayColumnsAsArray
            })
        } else {
            this.displaySelectionChanged(displayColumnsAsArray)
        }
        this.setState({
            displayColumns: display_columns,
            filterColumns: filterColumns
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
        this.unlisten();
    }

    render() {
        return (
            <div>
                <OperationContainer {...this.props}
                                    downloadClick={this.getDownloadTMS.bind(this)}
                                    downloadData={this.state.data}
                                    downloadFilename={`projector_report_${moment().format('DD_MM_YYYY_HH_mm_ss')}.csv`}
                                    displaySelectionChanged={this.displaySelectionChanged}
                                    totalItems={this.state.totalItems}
                                    headers={this.state.headers}
                                    items={this.getItems(this.state.items, this.state.filterColumns)}
                                    filterHeaders={this.state.filteredHeaders}
                                    filterItems={this.state.filterItems}
                                    onFilterClicked={(isOpen) => {
                                        this.setState({ isOpen });
                                    }}
                                    filterContainer={(isOpen) => {
                                        return <ProjectorFilterContainer {...this.props}
                                                                         filterItems={this.state.filterItems}
                                                                         isOpen={isOpen}/>
                                    }}
                />
                <WebTable {...this.props} isOpen={this.state.isOpen} loading={this.state.loading} totalItems={this.state.totalItems}
                          headers={this.state.filteredHeaders}
                          items={this.getItems(this.state.items, this.state.filterColumns)}/>
            </div>
        );
    }

    fetchData = ({limit = 20, page = 1, order_by, tms_name, type, display_columns}, callback) => {
        page = Math.max(1, page) - 1;
        let limit_statement = `limit=${limit}`;
        let offset_statement = `&offset=${page * limit}`;
        let order_by_statement = order_by ? `&order_by=${order_by}` : '';
        let tms_name_statement = tms_name != null ? `&tms__name__in=${tms_name}` : '';
        let type_statement = type != null ? `&type__in=${type}` : '';

        fetch(`/api/v1/projector/?${limit_statement}${offset_statement}${order_by_statement}${type_statement}${tms_name_statement}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(res => {
                return res.json()
            })
            .then(res => {
                if (callback) {
                    callback(res);
                    return;
                }
                if(this._isMounted){
                    this.setState({
                        loading: false,
                        items: res.objects,
                        totalItems: res.meta.total_count
                    })
                }
                this.displaySelectionChanged(display_columns)
            })
    };
    getItems = (items, filterColumns) => {
        items = items.map((item, index) => {
            let arr = [
                item.tms.id,
                item.tms.circuit.name,
                item.tms.name,
                item.type,
                item.serial,
                item.lamp_usage,
            ];
            arr = _.filter(arr, (x, i) => {
                return _.includes(filterColumns, i);
            });
            return arr;
        });
        return items;
    }
    getFilterSelections = () => {
        fetch(`/api/v1/projector/?limit=0`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(res => {
                return res.json()
            })
            .then(res => {
                if(this._isMounted) {
                    this.setState({
                        filterItems: {
                            tms_name: Object.keys(_.groupBy(res.objects, 'tms.name')).map(x => {
                                return {value: x}
                            }),
                            type: Object.keys(_.groupBy(res.objects, 'type')).map(x => {
                                return {value: x}
                            })
                        }
                    })
                }
            })
    };
    displaySelectionChanged = (values, index) => {
        let filteredHeaders = _.filter(this.state.headers, x => {
            return values.includes(x.value);
        });
        let filterColumns = _.map(filteredHeaders, x => {
            return this.state.headers.indexOf(x);
        });
        this.setState({
            filteredHeaders,
            filterColumns
        });
    };

    getDownloadTMS = (csvLink) => {
        let queryParams = new URLSearchParams(this.props.location.search);
        let limit = 0;
        let page = 0;
        let order_by = queryParams.get("order_by");
        let tms_name = queryParams.get("tms_name");
        let type = queryParams.get("type");
        let display_columns = this.state.displayColumns;
        let displayColumnsAsArray = _.split(display_columns, ',').filter(x => x !== "");

        this.fetchData({
            page,
            limit,
            order_by,
            tms_name,
            type,
            display_columns: displayColumnsAsArray
        }, (res) => {
            let totalItems = res.objects;
            let filteredHeaders = _.filter(this.state.headers, x => {
                return displayColumnsAsArray.includes(x.value);
            });
            let filterColumns = _.map(filteredHeaders, x => {
                return this.state.headers.indexOf(x);
            });
            let downloadHeader = filteredHeaders.map(x => x.value);
            let downloadItems = this.getItems(totalItems, filterColumns);
            downloadItems.unshift(downloadHeader);

            this.setState({
                data: downloadItems
            }, () => {
                csvLink.current.link.click()
            });
        })
    }

}

export default Projector;
