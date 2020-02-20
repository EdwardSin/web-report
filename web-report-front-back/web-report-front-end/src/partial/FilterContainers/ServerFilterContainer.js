import React, {Component} from 'react';
import '../../css/FilterContainer.scss';
import Select from '../Select';
import * as _ from 'lodash';


class ServerFilterContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            TMSNameValues: [],
            softwareValues: [],
            typeValues: []
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        let filterItems = nextProps.filterItems;
        let queryParams = new URLSearchParams(nextProps.location.search);
        let tms_name = _.split(queryParams.get('tms_name'), ',').filter(x => x !== "");
        let type = _.split(queryParams.get('type'), ',').filter(x => x !== "");
        let software = _.split(queryParams.get('software'), ',').filter(x => x !== "");
        if (filterItems) {
            tms_name = queryParams.get('tms_name') ? tms_name : filterItems.tms_name.map(x => x.value);
            type = queryParams.get('type') ? type : filterItems.type.map(x => x.value);
            software = queryParams.get('software') ? software : filterItems.software.map(x => x.value);
        }
        this.setState({
            TMSNameValues: tms_name,
            typeValues: type,
            softwareValues: software
        })
    }

    render() {
        let openClass = this.props.isOpen ? 'open' : '';
        let {filterItems} = this.props;
        return (
            <div className={`filter-container ${openClass}`}>
                <span className={`fas fa-caret-up ${openClass}`}></span>
                <div className={`filter-background`}>
                    <div className={'filter-content'}>
                        <div className={"col-lg-2"}>
                            <Select
                                className={"w-100 mb-3 mb-lg-0"}
                                label=""
                                placeholder="All TMS Name"
                                customPlaceholder={"TMS Name"}
                                selectedOptions={this.state.TMSNameValues}
                                options={filterItems.tms_name}
                                isSelectionChanged={this.isNameSelectionChanged}
                                multiple
                            />
                        </div>
                        <div className={"col-lg-2"}>
                            <Select
                                className={"w-100 mb-3 mb-lg-0"}
                                label=""
                                placeholder="All Type"
                                customPlaceholder={"Type"}
                                selectedOptions={this.state.typeValues}
                                options={filterItems.type}
                                isSelectionChanged={this.isTypeSelectionChanged}
                                multiple
                            />
                        </div>
                        <div className={"col-lg-2"}>
                            <Select
                                className={"w-100 mb-3 mb-lg-0"}
                                label=""
                                placeholder="All Software"
                                customPlaceholder={"Software"}
                                selectedOptions={this.state.softwareValues}
                                options={filterItems.software}
                                isSelectionChanged={this.isSoftwareSelectionChanged}
                                multiple
                            />
                        </div>
                        <div className={"col-lg-2 float-right float-lg-left"}>
                            <button onClick={() => {
                                let {typeValues, TMSNameValues, softwareValues} = this.state;
                                let searchParams = new URLSearchParams(this.props.location.search);
                                searchParams.set('tms_name', TMSNameValues);
                                searchParams.set('type', typeValues);
                                searchParams.set('software', softwareValues);
                                searchParams.set('page', '1');
                                this.props.history.push({
                                    location: this.props.location.pathname,
                                    search: searchParams.toString()
                                })
                            }} className={'btn btn-operation'}>Filter
                            </button>
                        </div>
                        <div className={"clearfix"}></div>
                    </div>
                </div>
            </div>
        );
    }

    isNameSelectionChanged = (values) => {
        this.setState({
            TMSNameValues: values
        })
    }
    isTypeSelectionChanged = (values) => {
        this.setState({
            typeValues: values
        })
    }
    isSoftwareSelectionChanged = (values) => {
        this.setState({
            softwareValues: values
        })
    }
}

export default ServerFilterContainer;
