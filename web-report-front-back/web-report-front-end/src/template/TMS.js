import React, {Component} from 'react';
import OperationContainer from '../partial/OperationContainer';
import WebTable from "../partial/WebTable";
import * as _ from 'lodash';
import * as moment from 'moment';
import TMSFilterContainer from "../partial/FilterContainers/TMSFilterContainer";


const headers = [{key: 'id', value: 'TMS ID', sortable: true},
    {key: 'circuit__name', value: 'Circuit', sortable: true},
    {key: 'name', value: 'Name', sortable: true},
    {key: 'host', value: 'Host', sortable: true},
    {key: 'port', value: 'Port', sortable: true},
    {key: 'dailyreporter_version', value: 'Daily Reporter Version', sortable: true},
    {key: 'tms_version', value: 'TMS Version', sortable: true},
    {key: 'tmsconnect_version', value: 'TMS Connect Version', sortable: true},
    {key: 'country', value: 'Country', sortable: true},
    {key: 'contact_person__name', value: 'Contact Person', sortable: true},
    {key: 'contact_person__number', value: 'Contact Number', sortable: true}
];

class TMS extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);

        this.state = {
            headers,
            loading: true,
            filteredHeaders: headers,
            filterColumns: [],
            items: [],
            isOpen: false,
            filterItems: {
                circuit: [],
                contact_person: [],
                tms_version: []
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
            if(this.props.location.pathname === location.pathname){
                let queryParams = new URLSearchParams(location.search);
                this.getParamsAndRefresh(queryParams);
            }
        });
    }

    getParamsAndRefresh(queryParams) {
        let limit = +queryParams.get("limit") || 20;
        let page = +queryParams.get("page") || 1;
        let order_by = queryParams.get("order_by");
        let contact_person = queryParams.get("contact_person");
        let circuit_name = queryParams.get("circuit_name");
        let tms_version = queryParams.get("tms_version");
        let display_columns = queryParams.get('display');
        display_columns = display_columns != null ? display_columns: headers.map(x => { return x.value + ","});
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
                contact_person,
                circuit_name,
                tms_version,
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
                                    downloadFilename={`tms_report_${moment().format('DD_MM_YYYY_HH_mm_ss')}.csv`}
                                    totalItems={this.state.totalItems}
                                    displaySelectionChanged={this.displaySelectionChanged}
                                    headers={this.state.headers}
                                    items={this.getItems(this.state.items, this.state.filterColumns)}
                                    filterHeaders={this.state.filteredHeaders}
                                    filterItems={this.state.filterItems}
                                    onFilterClicked={(isOpen) => {
                                        this.setState({ isOpen });
                                    }}
                                    filterContainer={(isOpen) => {
                                        return <TMSFilterContainer {...this.props} filterItems={this.state.filterItems}
                                        isOpen={isOpen} />
                                    }}
                />
                <WebTable {...this.props} isOpen={this.state.isOpen} loading={this.state.loading} totalItems={this.state.totalItems}
                          headers={this.state.filteredHeaders} items={this.getItems(this.state.items, this.state.filterColumns)}/>
            </div>
        );
    }

    fetchData = ({limit = 20, page = 1, order_by, contact_person, circuit_name, tms_version, display_columns}, callback) => {
        page = Math.max(1, page) - 1;
        let limit_statement = `limit=${limit}`;
        let offset_statement = `&offset=${page * limit}`;
        let order_by_statement = order_by ? `&order_by=${order_by}` : '';
        let contact_statement = contact_person != null ? `&contact_person__name__in=${contact_person}` : '';
        let circuit_statement = circuit_name != null ? `&circuit__name__in=${circuit_name}` : '';
        let tms_statement = tms_version != null ? `&tms_version__in=${tms_version}` : '';

        fetch(`/api/v1/tms/?${limit_statement}${offset_statement}${order_by_statement}${tms_statement}${contact_statement}${circuit_statement}`, {
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
                if(this._isMounted) {
                    this.setState({
                        loading: false,
                        items: res.objects,
                        totalItems: res.meta.total_count
                    });
                    this.displaySelectionChanged(display_columns)
                }

            })
    };
    getItems = (items, filterColumns) => {
        items = items.map((item, index) => {
            let arr = [item.id,
                item.circuit.name,
                item.name,
                item.host,
                item.port,
                item.dailyreporter_version,
                item.tms_version,
                item.tmsconnect_version,
                item.country,
                item.contact_person.name,
                item.contact_person.number
            ];
            arr = _.filter(arr, (x, i) => {
                return _.includes(filterColumns, i);
            });
            return arr;
        });
        return items;
    };
    getFilterSelections = () => {

        fetch(`/api/v1/tms/?limit=0`, {
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
                            circuit: Object.keys(_.groupBy(res.objects, 'circuit.name')).map(x => {
                                return {value: x}
                            }),
                            contact_person: Object.keys(_.groupBy(res.objects, 'contact_person.name')).map(x => {
                                return {value: x}
                            }),
                            tms_version: Object.keys(_.groupBy(res.objects, 'tms_version')).map(x => {
                                return {value: x}
                            })
                        }
                    })
                }
            })
    }
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
        let contact_person = queryParams.get("contact_person");
        let circuit_name = queryParams.get("circuit_name");
        let tms_version = queryParams.get("tms_version");
        let display_columns = this.state.displayColumns;
        let displayColumnsAsArray = _.split(display_columns, ',').filter(x => x !== "");

        this.fetchData({
            page,
            limit,
            order_by,
            contact_person,
            circuit_name,
            tms_version,
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
                data:downloadItems
            }, () => {
                csvLink.current.link.click()
            });
        })
    }
}


export default TMS;
