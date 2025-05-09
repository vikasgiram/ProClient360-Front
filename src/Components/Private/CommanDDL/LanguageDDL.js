
import { useEffect } from 'react'
import i18n from '../../Helper/Language/LangMain'


export const LanguageDDL = (props) => {
    const { Language, setLanguage } = props
    console.log("Language", Language);
    const LanguageData = [
        {
            id: 0,
            lang: "मराठी",
        },
        {
            id: 1,
            lang: "English",
        },

    ]

    // useEffect(() => {
    //     i18n.changeLanguage(Language.Label)
    // }, [Language.ID])

    const handleI18Next = (e) => {
        const { options, selectedIndex } = e.target

        let selectedOption = options[selectedIndex];
        let value = selectedOption.getAttribute('value');
        let name = selectedOption.getAttribute('name');

        i18n.changeLanguage(name)
        setLanguage({ ...Language, ID: value, Label: name })
        sessionStorage.setItem("LanguageId", value)
        sessionStorage.setItem("LanguageChange", name)


    }

    useEffect(() => {
        sessionStorage.setItem("LanguageId", 0)
        sessionStorage.setItem("LanguageChange", "मराठी")
        handleLanguageDDL(sessionStorage.getItem("LanguageId"), sessionStorage.getItem("LanguageChange"),)
    }, [])

    const handleLanguageDDL = (LableID, LableName) => {
        if (LanguageData && LanguageData.length > 0) {
            let list = LanguageData.map((item, index) => ({
                value: item.id,
                label: item.lang,
            }))

            setLanguage({
                DDL: list,
                ID: LableID == null ? list[0].value : LableID == 0 ? list[0].value : LableID,
                Label: LableName == null ? list[0].label : LableName == 'Marathi' ? list[0].label : LableName,
            })
        }
        else {
            setLanguage({
                DDL: [],
                ID: 0,
                Label: "Select...",
            })
        }

    }

    return (
        <div className="mr-3 ml-3 d-flex align-items-center" style={{ marginTop: '-2px' }}>
            <select
                className='LanguageID me-3 pb-1'
                value={Language.ID}
                onChange={(e) => (
                    handleI18Next(e)
                )}
            >
                {
                    Language.DDL.map((item) => (
                        <option value={item.value} name={item.label}>{item.label}</option>
                    ))
                }
            </select>
        </div>
    )
}