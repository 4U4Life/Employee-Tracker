import React from 'react';
import * as projectsService from '../../../services/projectsService'
import { Paginator, CustomLink } from '../../common'
import ProjectCreationForm  from './ProjectCreationForm'
import Icon, { UploadOutlined, UserOutlined } from '@ant-design/icons';
import { Spinner, Toast, ToastHeader, ToastBody } from 'reactstrap'
import axios from "axios";

export default class MyProjects extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            reqSource: undefined,
            user: props.user,
            projects: undefined,
            pagesCount: 0,
            itemsPerPage: 0,
            currentPage: 1,
            highlightedProjectId: undefined
        }
    }

    loadProjects = async (page=1) => {
        // console.log("Loading projects");
        await this.cancelPreviousRequests();
        const {reqSource, user} = this.state;
        try {
            const response = await projectsService.loadProjectList({user: {...user}}, reqSource.token, page);
            // console.log("Successful projects loading", res);
            const {data} = response;
            const projects = JSON.parse(data.results);
            this.setState({
                projects: projects,
                pagesCount: Math.ceil(data.count / data.page_size),
                currentPage: page,
            });
        } catch (error) {
            console.error(error.message);
            if (error.response.status === 400) {
                const fieldErrors = error.response.data;
                Object.keys(fieldErrors).map((fieldName) => {
                    fieldErrors[fieldName] = fieldErrors[fieldName].join(" ");
                    console.log(fieldErrors[fieldName]);
                });

                this.setState({
                    errors: fieldErrors
                });
            }
        }
    };

    cancelPreviousRequests = async () => {
        if (this.state.reqSource) {
            this.state.reqSource.cancel();
        }
        this.setState({reqSource: axios.CancelToken.source()});
    };

    componentDidMount() {
        this.loadProjects();
    }

    componentWillUnmount() {
        this.cancelPreviousRequests();
    }

    handlePageChange = async value => {
        // console.log("changing to ", value);
        await this.loadProjects(value);
    };

    handleProjectCreated = async id => {
        const { pagesCount } = this.state;
        this.setState({
            highlightedProjectId: id,
        });
        await this.loadProjects(pagesCount);
    };

    renderSingleProject(project) {
        const { highlightedProjectId } = this.state;
        return (
            <CustomLink
                to={`project/${project.id}`}
                tag="div"
                key={project.id}
            >
                <Toast
                    className={`m-3 rounded project-info${project.id === highlightedProjectId ? " highlighted" : ""}`}
                >
                    <ToastHeader className="pr-2" tag={props => <React.Fragment>{props.children}</React.Fragment>}>
                        <strong className="project-name col-8 text-left">{project.name}</strong>
                        <div className="col-4 p-0 d-flex justify-content-end">
                        <span className="project-budget d-flex align-items-center">
                            <Icon component={props => "$"} />
                            <span className="count">{project.budget_usd}</span>
                        </span>
                            <span className="project-employee-count d-flex align-items-center ml-sm-1">
                            <UserOutlined/>
                            <span className="count">{project.members_count}</span>
                        </span>
                        </div>
                    </ToastHeader>
                    <ToastBody>
                        {project.description}
                    </ToastBody>
                </Toast>
            </CustomLink>
        );
    }

    renderProjects() {
        const { projects } = this.state;
        return (
            <React.Fragment>
                {projects.map(proj => this.renderSingleProject(proj))}
            </React.Fragment>
        );
    }

    render() {
        const { user, projects, currentPage, pagesCount } = this.state;
        if (projects === undefined) {
            return <Spinner/>
        }
        return (
            <React.Fragment>
                <ProjectCreationForm
                    user={user}
                    onProjectCreated={this.handleProjectCreated}
                />
                <div className="row d-flex flex-wrap">
                    {this.renderProjects()}
                </div>
                <Paginator
                    className={"row d-flex justify-content-center py-auto"}
                    page={currentPage}
                    count={pagesCount}
                    onPageChange={this.handlePageChange}
                />

            </React.Fragment>
        );
    }
};