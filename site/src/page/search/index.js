import { Input, Select } from 'antd'
import ReactWordcloud from 'react-wordcloud';
import logo from '@assets/img/logo.png'
import { SERACH_OPTIONS } from '@constant/data'
import { HOT_WORDS, HOT_BORROW, HOT_BOOK } from '@constant/mock'
import './index.less'

const { Search } = Input;
const { Option } = Select;

function Home() {
    const onSearch = value => console.log(value);

    return (
        <div className="search">
            <img className="logo" alt="logo" src={logo} />
            <Input.Group compact>
                <Select style={{ width: 100 }} defaultValue={SERACH_OPTIONS[0].id || ''}>
                    {SERACH_OPTIONS.map(item => 
                        <Option value={item.id} key={item.id}>{item.name}</Option>
                    )}
                </Select>
                <Search className="search-bar" placeholder="搜索图书..." onSearch={onSearch} enterButton />
            </Input.Group>
            <div className="data-statistic">
                <div className="data-card">
                    <div className="card-title hvr-sweep-to-right">热门检索</div>
                    <ReactWordcloud style={{ height: 220, width: 228, marginTop: 5, paddingLeft: 15 }} words={HOT_WORDS} />
                </div>
                <div className="data-card">
                    <div className="card-title hvr-sweep-to-right">热门借阅</div>
                    <div className="card-content">
                        {HOT_BORROW.map((item, index)=>
                            <div className="cont-item" key={`hbor${index}`}>{item}</div>
                        )}
                    </div>
                </div>
                <div className="data-card">
                    <div className="card-title hvr-sweep-to-right">热门图书</div>
                    <div className="card-content">
                        {HOT_BOOK.map((item, index) =>
                            <div className="cont-item" key={`hbok${index}`}>{item}</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;