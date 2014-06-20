CREATE DATABASE [GA_MI]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'GA_MI', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL11.DSDSERVER\MSSQL\DATA\GA_MI.mdf' , SIZE = 12288KB , MAXSIZE = UNLIMITED, FILEGROWTH = 1024KB )
 LOG ON 
( NAME = N'GA_MI_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL11.DSDSERVER\MSSQL\DATA\GA_MI_log.ldf' , SIZE = 22144KB , MAXSIZE = 2048GB , FILEGROWTH = 10%)
GO

ALTER DATABASE [GA_MI] SET COMPATIBILITY_LEVEL = 90
GO

USE GA_MI

IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'getNeeded') DROP PROCEDURE getNeeded
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'insertValues') DROP PROCEDURE insertValues
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'insertPagePath') DROP PROCEDURE insertPagePath
IF EXISTS (select * from sys.objects where type = 'U' and name ='fact_data') drop table fact_data
IF EXISTS (select * from sys.objects where type = 'U' and name ='dim_dimensions') drop table dim_dimensions
IF EXISTS (select * from sys.objects where type = 'U' and name ='dim_metrics') drop table dim_metrics
IF EXISTS (select * from sys.objects where type = 'U' and name ='dim_pageviews') drop table dim_pageviews

Create table dim_metrics (
  metric_id integer identity(1000,1)
, metric_tidy varchar(1000)
, metric varchar(1000)
, created_date datetime default getdate()
Constraint pk_metric_id primary key (metric_id)
)

Create table dim_dimensions (
  dimension_id integer identity(1000,1)
, ga_year integer
, ga_month integer
, ga_day integer
, ga_hour integer
, real_date datetime
, metric_id integer
, created_date datetime default getdate()
Constraint pk_dimension_id primary key (dimension_id)
, Constraint fk_metric_dim_id foreign key (metric_id) references dim_metrics(metric_id)
)

Create table dim_pageviews (
  pageview_id integer identity(1000,1)
, pageview varchar(1000)
Constraint pk_pageview_id primary key (pageview_id)
)

Create table fact_data (
  id bigint identity(1000,1)
, dimension_id integer
, metric_id integer
, pageview_id integer null
, value decimal
, created_date datetime default getdate()
Constraint pk_id primary key (id)
, Constraint fk_dimension_id foreign key (dimension_id) references dim_dimensions(dimension_id)
, Constraint fk_metric_id foreign key (metric_id) references dim_metrics(metric_id)
, Constraint fk_pageview_id foreign key (pageview_id) references dim_pageviews(pageview_id)
)

insert into dim_metrics (metric_tidy, metric) values ('Sessions','ga:sessions')
insert into dim_metrics (metric_tidy, metric) values ('Users','ga:users')
insert into dim_metrics (metric_tidy, metric) values ('Page Views','ga:pageviews')


declare @sDate datetime = {ts '2014-03-31 08:00:00'}
declare @eDate datetime = {ts '2020-01-01 00:00:00'}
declare @metric_count integer = (Select count(*) from dim_metrics)
while @sDate < @eDate
begin
	declare @i integer = 1
	while @i <= @metric_count
	begin

		declare @metric_id integer = (Select top 1 a.metric_id from (Select top (select @i) metric_id from dim_metrics order by 1  )a order by 1 desc)
		insert into dim_dimensions (ga_year,ga_month,ga_day,ga_hour,real_date,metric_id) values (
			  datepart(YEAR,@sDate)
			, datepart(MONTH,@sDate)
			, datepart(DAY,@sDate)
			, datepart(HOUR,@sDate)
			, @sDate
			, @metric_id
		)
	set @i = @i + 1
	end
	
	Set @sDate = DATEADD(HOUR,1,@sDate)
end

GO

Create procedure getNeeded
as 
Select dim_dimensions.dimension_id
, dim_dimensions.ga_year
, dim_dimensions.ga_month
, dim_dimensions.ga_day
, dim_dimensions.ga_hour
, dim_dimensions.real_date
, dim_metrics.metric
From
(
	Select min(dims.dimension_id) as dimension_id
	From
	(
		Select dimension_id
		, ga_year
		, ga_month
		, ga_day
		, metric_id
		From dim_dimensions
		Where real_date < dateadd(HOUR,-2,getdate())
	) dims
	Left Join 
	(
		Select dimension_id 
		from fact_data
	) facts
	on dims.dimension_id = facts.dimension_id
	where facts.dimension_id is null
	group by ga_year
	, ga_month
	, ga_day
	, dims.metric_id
) dim_ids
Join dim_dimensions on dim_dimensions.dimension_id = dim_ids.dimension_id
Join dim_metrics on dim_dimensions.metric_id = dim_metrics.metric_id
order by dim_dimensions.dimension_id, dim_metrics.metric

GO

Create Proc insertValues(
	  @year integer
	, @month integer
	, @day integer
	, @hour integer
	, @metric varchar(1000)
	, @value integer
) as

declare @dimension_id integer
declare @metric_id integer

select @dimension_id=dim.dimension_id 
, @metric_id=dim.metric_id
from dim_dimensions dim
Join dim_metrics met
on dim.metric_id = met.metric_id
where dim.ga_year = @year
and dim.ga_month = @month
and dim.ga_day = @day
and dim.ga_hour = @hour
and met.metric = @metric

delete from fact_data where dimension_id = @dimension_id
insert into fact_data (dimension_id,metric_id,value)
values (
	  @dimension_id
	, @metric_id
	, @value
)

GO

Create Proc insertPagePath(
	  @year integer
	, @month integer
	, @day integer
	, @hour integer
	, @pagepath varchar(1000)
	, @metric varchar(1000)
	, @value integer
) as

declare @dimension_id integer
declare @metric_id integer
declare @pageview_id integer

select @pageview_id=pageview_id from dim_pageviews where pageview = @pagepath

if @pageview_id is null
begin
	insert into dim_pageviews (pageview) values (@pagepath)
	select @pageview_id=pageview_id from dim_pageviews where pageview = @pagepath
end

select @dimension_id=dim.dimension_id 
, @metric_id=dim.metric_id
from dim_dimensions dim
Join dim_metrics met
on dim.metric_id = met.metric_id
where dim.ga_year = @year
and dim.ga_month = @month
and dim.ga_day = @day
and dim.ga_hour = @hour
and met.metric = @metric

delete from fact_data where dimension_id = @dimension_id and pageview_id = @pageview_id
insert into fact_data (dimension_id,metric_id,pageview_id,value)
values (
	  @dimension_id
	, @metric_id
	, @pageview_id
	, @value
)
