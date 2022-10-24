import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import {selectAll} from "../heroesFilters/HeroesFiltersSlice";

import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

import {useHttp} from '../../hooks/http.hook';
import { heroCreated } from '../heroesList/heroesSlice';

const schema = yup.object({
    name: yup.string()
            .min(2, 'Min 2 symbols!')
            .required('Required filed'),
    text: yup.string()
            .min(5, 'Min 5 symbols!')
            .required('Required filed'),
    element: yup.string()
            .oneOf(['fire', 'water', 'wind', 'earth'], 'choose element')
  }).required();

const HeroesAddForm = () => {

    const filters = useSelector(selectAll);
    const {filtersLoadingStatus} = useSelector(state => state.filters);
    const dispatch = useDispatch();
    const {request} = useHttp();

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });
        
    const onSubmit = ({name, text, element}) => {
        const newHero = {
                id: uuidv4(),
                name,
                description: text,
                element
            };
        
        request("http://localhost:3001/heroes", 'POST', JSON.stringify(newHero))
            .then(data => console.log(data, 'Post successful'))
            .then(dispatch(heroCreated(newHero)))
            .catch(error => console.log(error));

        reset();
    };
    
    const renderFilters = (filters, status) => {
        if (status === 'loading') return <option>Elements is Loading</option>
        else if (status === "error") return <option>Loading error!</option>

        if (filters && filters.length > 0) {
            return filters.map((e, i) => {
                return e.val === 'all' ? 
                        <option key={i}>Я владею элементом...</option> :
                        <option key={i} value={e.val}>{e.text}</option>
            });
        }
    }
    
    return (
        <form 
            className="border p-4 shadow-lg rounded"
            onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                <input 
                    type="text" 
                    // name="name" 
                    className="form-control" 
                    id="name" 
                    placeholder="Как меня зовут?"
                    {...register("name")}/>
                    <p>{errors.name?.message}</p>
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">Описание</label>
                <textarea
                    // name="text" 
                    className="form-control" 
                    id="text" 
                    placeholder="Что я умею?"
                    style={{"height": '130px'}}
                    {...register("text")}/>
                    <p>{errors.text?.message}</p>
                    
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                <select 
                    className="form-select" 
                    id="element" 
                    // name="element"
                    {...register("element")}>
                    {renderFilters(filters, filtersLoadingStatus)}
                </select>
                <p>{errors.element?.message}</p>
            </div>

            <button className="btn btn-primary">Создать</button>
        </form>
    )
}

export default HeroesAddForm;