import React from "react";
import InputEditCV from "./InputEditCV";
import { Typography } from "@material-tailwind/react";

const IconicCV = () => {
  return (
    <div className="flex flex-col gap-2 w-full h-full">
      <div className="grid grid-cols-12 gap-4 w-full">
        <div className="col-span-9">
          <InputEditCV type="title" value="Nguyen Van A" />
          <div className="grid grid-cols-2 gap-1">
            <div className="flex flex-col gap-1">
              <InputEditCV
                isBlock={false}
                type="info"
                label="Name"
                value="Nguyen Van A"
              />
              <InputEditCV
                isBlock={false}
                type="info"
                label="Email"
                value="nguyenvana@gmail.com"
              />
              <InputEditCV
                isBlock={false}
                type="info"
                label="Phone"
                value="+84 123456789"
              />
            </div>
            <div className="flex flex-col gap-1">
              <InputEditCV
                isBlock={false}
                type="info"
                label="Birth"
                value="20/11/2023"
              />
              <InputEditCV
                isBlock={false}
                type="info"
                label="Address"
                value="Da Nang, Viet Nam"
              />
              <InputEditCV
                isBlock={false}
                type="info"
                label="Github"
                value="https://github.com/vana"
              />
            </div>
          </div>
        </div>
        <div className="col-span-3">avatar</div>
      </div>
      <div className="w-full flex flex-col gap-2">
        <Typography className="text-xl font-bold text-teal-800">
          Overview
        </Typography>
        <div className="h-[2px] w-full bg-teal-800"></div>
        <InputEditCV
          label="Name"
          value="- Over 2 years of experience in programming with good communication and quick learning skills<br>
            - Strengths: Front-end technology and Back-end web application development<br>
            - Proficiency in HTML, CSS, JavaScript<br>
            - Experience with popular React.js workflows (such as Flux or Redux)<br>
            - Familiarity with RESTful APIs<br>
            - Strong Experience in: PHP, JavaScript (ReactJS, React-native), MySQL, NoSQL, GraphQL, Redis, JSON, API, Docker, Kubernetes, Rancher, AWS services<br>"
        />
      </div>
      <div className="w-full flex flex-col gap-2">
        <Typography className="text-xl font-bold text-teal-800">
          Work Experience
        </Typography>
        <div className="h-[2px] w-full bg-teal-800"></div>
        <InputEditCV
          type="experience"
          label="01/2018 – Present"
          value="F8 TECHNOLOGY EDUCATION.,JSC"
          description="Full-stack Developer<br>
            - Programme outsourcing projects<br>
            - Create coding frames and design database based on project descriptions"
        />
      </div>
      <div className="w-full flex flex-col gap-2">
        <Typography className="text-xl font-bold text-teal-800">
          Skills
        </Typography>
        <div className="h-[2px] w-full bg-teal-800"></div>
        <InputEditCV
          type="info"
          label="Main"
          value="- HTML, CSS, JavaScript (ReactJS, React-Native, Lit)<br>
            - PHP (Laravel, Symfony, Codeigniter, Yii)<br>
            - Node (ExpressJS)<br>
            - RESTful API, GraphQL<br>
            - MySQL, PostgreSQL, NoSQL (MongoDB)<br>
            - Server (Apache, Nginx, Redis, Memcached, Queue, Log, Crontjob...), Rancher, K8S, Docker<br>
            - AWS (Load balancing, EC2, ECS, Router 53, RDS, S3)"
        />
        <InputEditCV
          type="info"
          label="Other"
          value="- Ruby (Ruby on Rails)<br>
            - SVN, GIT<br>
            - Python (selenium automation test, crawler)<br>
            - Elasticsearch<br>
            - Tensorflow"
        />
      </div>
      <div className="w-full flex flex-col gap-2">
        <Typography className="text-xl font-bold text-teal-800">
          Education
        </Typography>
        <div className="h-[2px] w-full bg-teal-800"></div>
        <InputEditCV
          type="experience"
          label="2011/10 – 2014/09"
          value="FPT Polytechnic"
          description="Major - Website, Mobile Programming<br>
          Level - Good"
        />
      </div>
      <div className="w-full flex flex-col gap-2">
        <Typography className="text-xl font-bold text-teal-800">
          Project
        </Typography>
        <div className="h-[2px] w-full bg-teal-800"></div>
        <InputEditCV type="project" />
      </div>
      <div>Other</div>
    </div>
  );
};

export default IconicCV;
