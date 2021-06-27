import { FieldError } from "../../types/FieldError";
import { ProductInput } from "../../types/ProductInput";

export const validateProduct = (input: ProductInput) => {

    let errors: FieldError[] = [];
    if(input.title.trim() === ""){
            errors.push({
                field: "title",
                message: "se necesita un titulo para el producto",
            });
    }

    if(input.title.length > 100){
        errors.push({
            field: "title",
            message: "el titulo no puede tener mas de 100 caracteres",
        });
    }
    if(input.text.trim() === ""){
        errors.push({
            field: "text",
            message: "el producto necesita una descripcion",
        });
    }
    if(input.text.length > 500){
        errors.push({
            field: "text",
            message: "la descripcion no puede tener mas de 500 caracteres",
        });
    }

    if(input.price < 100){
        errors.push({
            field: "price",
            message: "el precio no puede ser menor a 100",
        });
    }

    if(input.price > 20000){
        errors.push({
            field: "price",
            message: "el precio no puede ser mayor a 20,000",
        });
    }

    if(input.quantity < 1){
        errors.push(
            {
                field: "quantity",
                message: "la cantidad no puede ser menor a 1",
            }
        );
    }

    if(input.quantity > 200){
        errors.push(
            {
                field: "quantity",
                message: "la cantidad no puede ser mayor a 200",
            }
        );
    }
    
    if(errors.length > 0){
        return errors
    }

    return null;
}