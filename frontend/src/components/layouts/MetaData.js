import { Helmet } from "react-helmet-async"

// for handle title using Helmet package
export default function MetaData({title}){
    return (
        <Helmet>
            <title>{`${title} - AllinOne`}</title>
        </Helmet>
    )
}