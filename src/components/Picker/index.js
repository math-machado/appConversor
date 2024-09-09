import { Picker } from "@react-native-picker/picker"

export default function PickerItem(props){

    return(
        <Picker
        selectedValue={props.moedaSelecionada}
        onValueChange={props.onChange}
        >
            {props.moedas.map((item, index) => {
                return(
                    <Picker.Item value={item.key} key={index} label={item.key}/>
                )
            })}
        </Picker>
    )
}