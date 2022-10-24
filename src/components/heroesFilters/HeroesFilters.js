import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { fetchFilters, filterChange, selectAll } from "./HeroesFiltersSlice";
import Spinner from "../spinner/Spinner";

const HeroesFilters = () => {

    const filters = useSelector(selectAll);
    const {activeFilter, filtersLoadingStatus} = useSelector(state => state.filters);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchFilters());
        // eslint-disable-next-line
    }, []);

    const onFilterChange = (filter) => {
        dispatch(filterChange(filter))
    }

    if (filtersLoadingStatus === 'loading') {
        return <Spinner/>
    } else if (filtersLoadingStatus === 'error') {
        return <h5 className="text-center mt-5">Loading Error</h5>
    }
    
    const renderFilters = arr => {
        if (arr.length === 0) return <h5 className="text-center mt-5">There is no filters</h5>

        return arr.map(e => {
            const clazz = activeFilter === e.val ? 'active' : null;
            return <button key={e.val} onClick={() => onFilterChange(e.val)} className={`btn ${e.btnClass} ${clazz}`}>{e.text}</button>
        });
    }

    const btns = renderFilters(filters);
    
    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Отфильтруйте героев по элементам</p>
                <div className="btn-group">
                    {filtersLoadingStatus === 'loading' ? <Spinner/> : null}
                    {btns}
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;