import React, {Component} from 'react';
import '../../css/FilterContainer.scss';
import Select from '../Select';
import * as _ from 'lodash';


class TMSFilterContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            circuitValues: [],
            contactPersonValues: [],
            TMSVersionValues: []
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        let filterItems = nextProps.filterItems;
        let queryParams = new URLSearchParams(nextProps.location.search);
        let circuit_name = _.split(queryParams.get('circuit_name'), ',').filter(x => x !== "");
        let tms_version = _.split(queryParams.get('tms_version'), ',').filter(x => x !== "");
        let contact_person = _.split(queryParams.get('contact_person'), ',').filter(x => x !== "");
        if (filterItems) {
            circuit_name = queryParams.get('circuit_name') ? circuit_name : filterItems.circuit.map(x => x.value);
            tms_version = queryParams.get('tms_version') ? tms_version : filterItems.tms_version.map(x => x.value);
            contact_person = queryParams.get('contact_person') ? contact_person : filterItems.contact_person.map(x => x.value);
        }

        this.setState({
            circuitValues: circuit_name,
            contactPersonValues: contact_person,
            TMSVersionValues: tms_version
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
                                placeholder="All Circuit"
                                customPlaceholder={"Circuit"}
                                selectedOptions={this.state.circuitValues}
                                options={filterItems.circuit}
                                isSelectionChanged={this.isCircuitSelectionChanged}
                                multiple
                            />
                        </div>
                        <div className={"col-lg-2"}>
                            <Select
                                className={"w-100 mb-3 mb-lg-0"}
                                label=""
                                placeholder="All Contact Person"
                                customPlaceholder={"Contact Person"}
                                selectedOptions={this.state.contactPersonValues}
                                options={filterItems.contact_person}
                                isSelectionChanged={this.isContactPersonSelectionChanged}
                                multiple
                            />
                        </div>
                        <div className={"col-lg-2"}>
                            <Select
                                className={"w-100 mb-3 mb-lg-0"}
                                label=""
                                placeholder="All TMS Version"
                                customPlaceholder={"TMS Version"}
                                selectedOptions={this.state.TMSVersionValues}
                                options={filterItems.tms_version}
                                isSelectionChanged={this.isTMSVersionSelectionChanged}
                                multiple
                            />
                        </div>
                        <div className={"col-lg-2 float-right float-lg-left"}>
                            <button onClick={() => {
                                let {circuitValues, contactPersonValues, TMSVersionValues} = this.state;
                                let searchParams = new URLSearchParams(this.props.location.search);
                                searchParams.set('contact_person', contactPersonValues);
                                searchParams.set('circuit_name', circuitValues);
                                searchParams.set('tms_version', TMSVersionValues);
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

    isCircuitSelectionChanged = (values) => {
        this.setState({
            circuitValues: values
        })
    };
    isContactPersonSelectionChanged = (values) => {
        this.setState({
            contactPersonValues: values
        })
    };
    isTMSVersionSelectionChanged = (values) => {
        this.setState({
            TMSVersionValues: values
        })
    };
}

export default TMSFilterContainer;
